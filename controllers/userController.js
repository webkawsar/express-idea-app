const _ = require('lodash');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const util = require('util');
const User = require('../models/User');
const generateUserDoc = require('../helpers/generateUserDoc');
const generateIdeaDoc = require('../helpers/generateIdeaDoc');
const Category = require('../models/Category');
const generateCategoryDoc = require('../helpers/generateCategoryDoc');

const deleteFilePromise = util.promisify(fs.unlink);

/*
 * @params:
 * @queryString:
 * @api: { GET } /users/me
 *
 */

// eslint-disable-next-line consistent-return
exports.me = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).render('notFound', { title: 'Not Found' });

    res.render('users/profile', {
        title: `Profile of ${user.firstName}`,
        path: '/users/me',
        user: generateUserDoc(user),
    });
};

/*
 * @params:
 * @queryString:
 * @api: { GET } /users/me/edit
 *
 */

// eslint-disable-next-line consistent-return
exports.editForm = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).render('notFound', { title: 'Not Found' });

    res.render('users/edit-profile', {
        title: `Edit profile of ${user.firstName}`,
        path: '/users/me',
        userInput: generateUserDoc(user),
    });
};

/*
 * @params:
 * @queryString:
 * @api: { PUT } /users/me
 *
 */
// eslint-disable-next-line consistent-return
exports.update = async (req, res) => {
    const pickedValue = _.pick(req.body, ['firstName', 'lastName']);
    if (req.file) {
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${
            req.file.originalname
        }`;
        await sharp(req.file.buffer)
            .resize({ width: 300, height: 300 })
            .png()
            .toFile(`${path.join(__dirname, '../public/uploads/users/')}/${fileName}`);

        pickedValue.image = fileName;
        if (req.user.imageURL) {
            req.user.imageURL = undefined;
            await req.user.save({ validateBeforeSave: false });
        }

        // delete existing image
        if (req.user.image) {
            await deleteFilePromise(
                `${path.join(__dirname, '../public/uploads/users')}/${req.user.image}`
            );
            console.log('Existing profile image deleted successfully');
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id, pickedValue);
    if (!user) return res.status(404).render('notFound', { title: 'Not Found' });

    req.flash('success_msg', 'Your profile updated successfully');
    res.redirect('/users/me');
};

/*
 * @params:
 * @queryString:
 * @api: { GET } /users/ideas
 *
 */

// eslint-disable-next-line consistent-return
exports.getIdeas = async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id).populate({
        path: 'ideas',
        options: {
            sort: {
                createdAt: -1,
            },
        },
    });
    if (!user) return res.status(404).render('notFound', { title: 'Not Found' });

    const generateIdeas = [];
    user.ideas.forEach((idea) => {
        if (idea.status === 'public') {
            generateIdeas.push(generateIdeaDoc(idea));
        }
    });

    // Categories
    const allCategories = await Category.find();
    const categories = allCategories.map((category) => generateCategoryDoc(category));

    // Pagination
    const page = +req.query.page || 1;
    const itemPerPage = 2;
    const totalPublicIdeasCount = generateIdeas.length;
    const publicIdeas = generateIdeas.splice((page - 1) * itemPerPage, itemPerPage);

    res.render('ideas/index', {
        title: `All Ideas by ${user.firstName}`,
        ideas: publicIdeas,
        userRef: true,
        categories,
        firstName: user.firstName,
        userId: id,
        currentPage: page,
        previousPage: page - 1,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        hasNextPage: page * itemPerPage < totalPublicIdeasCount,
        lastPage: Math.ceil(totalPublicIdeasCount / itemPerPage),
    });
};

/*
 * @params:
 * @queryString:
 * @api: { DELETE } /users/me
 *
 */
// eslint-disable-next-line consistent-return
exports.delete = async (req, res) => {
    const user = await req.user.remove();
    if (!user) return res.status(404).render('notFound', { title: 'Not Found' });

    req.logout();
    req.flash('success_msg', 'Your Account deleted successfully');
    res.redirect('/');
};

/*
 * @params:
 * @queryString:
 * @api: { GET } /users/me/ideas
 *
 */
// eslint-disable-next-line consistent-return
exports.getMyIdeas = async (req, res) => {
    const user = await User.findById(req.user.id).populate('ideas');
    if (!user) return res.status(404).render('notFound', { title: 'Not Found' });

    const generateIdea = user.ideas.map((idea) => generateIdeaDoc(idea));

    res.render('users/dashboard', {
        title: `All Ideas by ${user.firstName}`,
        ideas: generateIdea,
        firstName: user.firstName,
        path: '/users/me/ideas',
    });
};
