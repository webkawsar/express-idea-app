const mongoose = require('mongoose');
const _ = require('lodash');
const sharp = require('sharp');
const path = require('path');
const util = require('util');
const fs = require('fs');
const Idea = require('../models/Idea');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const generateIdeaDoc = require('../helpers/generateIdeaDoc');
const generateCommentDoc = require('../helpers/generateCommentDoc');
const generateCategoryDoc = require('../helpers/generateCategoryDoc');

const deleteFilePromise = util.promisify(fs.unlink);

// Get All Ideas
exports.getAll = async (req, res) => {
    const page = +req.query.page || 1;
    const itemPerPage = 2;
    const totalPublicIdeasCount = await Idea.find({ status: 'public' }).countDocuments();
    const publicIdeas = await Idea.find({ status: 'public' })
        .skip((page - 1) * itemPerPage)
        .sort({ createdAt: -1 })
        .limit(itemPerPage);
    const generateIdea = publicIdeas.map((idea) => generateIdeaDoc(idea));

    // Categories
    const allCategories = await Category.find();
    const categories = allCategories.map((category) => generateCategoryDoc(category));

    res.render('ideas/index', {
        title: 'All Ideas',
        ideas: generateIdea,
        categories,
        currentPage: page,
        previousPage: page - 1,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        hasNextPage: page * itemPerPage < totalPublicIdeasCount,
        lastPage: Math.ceil(totalPublicIdeasCount / itemPerPage),
    });
};

// Get Add Idea form
exports.new = async (req, res) => {
    const categories = await Category.find();
    const categoriesDoc = categories.map((category) => generateCategoryDoc(category));

    res.render('ideas/new', { title: 'Add New Idea', categories: categoriesDoc });
};

// Get Single Idea
// eslint-disable-next-line consistent-return
exports.getSingle = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).render('notFound', { title: 'Not found' });
    }
    let idea = await Idea.findById(id).populate(['comments', 'category']);
    if (!idea) return res.status(404).render('notFound', { title: 'Not found' });

    idea = generateIdeaDoc(idea);
    if (idea.comments) {
        idea.comments = idea.comments.map((comment) => generateCommentDoc(comment));
    }
    res.render('ideas/show', { title: idea.title, idea });
};

// Get Edit Idea Form
// eslint-disable-next-line consistent-return
exports.edit = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).render('notFound', { title: 'Not found' });
    }

    const categories = await Category.find();
    const categoriesDoc = categories.map((category) => generateCategoryDoc(category));

    let idea = await Idea.findById(id);
    if (idea) {
        idea = generateIdeaDoc(idea);
        res.render('ideas/edit', {
            title: idea.title,
            idea,
            categories: categoriesDoc,
        });
    } else {
        res.status(404).render('notFound', { title: 'Not found' });
    }
};

// create Idea
exports.create = async (req, res) => {
    const category = await Category.findOne({ category: req.body.category });
    const idea = new Idea({
        ...req.body,
        user: {
            _id: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
        },
        category: {
            _id: category,
            categoryName: category.category,
        },
    });

    if (req.file) {
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${
            req.file.originalname
        }`;

        await sharp(req.file.buffer)
            .resize({ width: 1200, height: 300 })
            .png()
            .toFile(`${path.join(__dirname, '../public/uploads/ideas')}/${fileName}`);

        idea.image = fileName;
    }

    await idea.save();

    req.flash('success_msg', 'Idea created successfully');
    // redirect user
    res.redirect('/ideas');
};

// update idea
exports.update = async (req, res) => {
    const { id } = req.params;
    const idea = await Idea.findById(id);
    // update value
    const pickedValue = _.pick(req.body, [
        'title',
        'description',
        'status',
        'allowComments',
        'tags',
    ]);

    if (req.file) {
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${
            req.file.originalname
        }`;

        await sharp(req.file.buffer)
            .resize({ width: 1200, height: 300 })
            .png()
            .toFile(`${path.join(__dirname, '../public/uploads/ideas')}/${fileName}`);

        pickedValue.image = fileName;

        // delete existing image
        if (idea.image) {
            await deleteFilePromise(
                `${path.join(__dirname, '../public/uploads/ideas')}/${idea.image}`
            );
            console.log('Existing idea image deleted successfully');
        }
    }

    const updateIdea = await Idea.findByIdAndUpdate(id, pickedValue);
    if (updateIdea) {
        req.flash('success_msg', 'Idea updated successfully');
        res.redirect(`/ideas/${id}`);
    } else {
        res.status(404).render('notFound', { title: 'Not found' });
    }
};

// Delete Idea
// eslint-disable-next-line consistent-return
exports.delete = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).render('notFound', { title: 'Not found' });
    }

    const idea = await Idea.findByIdAndDelete(id);
    // delete existing image
    if (idea.image) {
        await deleteFilePromise(`${path.join(__dirname, '../public/uploads/ideas')}/${idea.image}`);
        console.log('Idea image deleted successfully');
    }
    if (idea) {
        req.flash('success_msg', 'Idea delete successfully');
        res.redirect('/ideas');
    } else {
        res.status(404).render('notFound', { title: 'Not found' });
    }
};

/*
 * @params:
 * @queryString:
 * @api: { POST } /ideas/:id/likes
 *
 */
// eslint-disable-next-line consistent-return
exports.toggleLike = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).render('notFound', { title: 'Not found' });
    }

    const idea = await Idea.findById(id);
    if (!idea) return res.status(404).render('notFound', { title: 'Not found' });

    const foundLike = await Like.findOne({ 'user._id': req.user.id, idea: id });
    if (!foundLike) {
        const like = new Like({
            idea: id,
            user: {
                _id: req.user.id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
            },
        });
        await like.save();
        return res.status(200).send({ success: true, message: 'You like the idea' });
    }

    // remove like from idea
    const like = await Like.findByIdAndDelete(foundLike.id);
    if (!like) {
        return res.status(200).send({ success: false, message: 'Idea not found' });
    }

    res.status(200).send({ success: true, message: 'You unlike the idea' });
};

/*
 * @params:
 * @queryString:
 * @api: { GET } /ideas/:id/likes
 *
 */
exports.likeCount = async (req, res) => {
    const { id } = req.params;
    const count = await Like.find({ idea: id }).count();

    res.status(200).send({ success: true, count });
};

/*
 * @params:
 * @queryString:
 * @api: { GET } /ideas/:id/comments
 *
 */
exports.commentCount = async (req, res) => {
    const { id } = req.params;
    const count = await Comment.find({ idea: id }).count();

    res.status(200).send({ success: true, count });
};
