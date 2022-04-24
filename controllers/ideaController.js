const mongoose = require('mongoose');
const _ = require('lodash');
const Idea = require('../models/Idea');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const generateIdeaDoc = require('../helpers/generateIdeaDoc');
const generateCommentDoc = require('../helpers/generateCommentDoc');
const generateCategoryDoc = require('../helpers/generateCategoryDoc');

// Get All Ideas
exports.getAll = async (req, res) => {
    const ideas = await Idea.find({ status: 'public' });
    const generateIdea = ideas.map((idea) => generateIdeaDoc(idea));

    res.render('ideas/index', {
        title: 'All Ideas',
        ideas: generateIdea,
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
    let idea = await Idea.findById(id).populate('comments');
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

    let idea = await Idea.findById(id);
    if (idea) {
        idea = generateIdeaDoc(idea);
        res.render('ideas/edit', { title: idea.title, idea });
    } else {
        res.status(404).render('notFound', { title: 'Not found' });
    }
};

// create Idea
exports.create = async (req, res) => {
    return;
    const idea = new Idea({
        ...req.body,
        user: {
            _id: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
        },
    });
    await idea.save();
    req.flash('success_msg', 'Idea created successfully');
    // redirect user
    res.redirect('/ideas');
};

// update idea
exports.update = async (req, res) => {
    const { id } = req.params;
    // update value
    const pickedValue = _.pick(req.body, [
        'title',
        'description',
        'status',
        'allowComments',
        'tags',
    ]);

    const idea = await Idea.findByIdAndUpdate(id, pickedValue);
    if (idea) {
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
