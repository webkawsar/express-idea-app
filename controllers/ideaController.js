const mongoose = require('mongoose');
const _ = require('lodash');
const Idea = require('../models/Idea');
const generateIdeaDoc = require('../helpers/ideaDoc');
const generateCommentDoc = require('../helpers/commentDoc');

// Get All Ideas
exports.getAll = async (req, res) => {
    const ideas = await Idea.find();
    const generateIdea = ideas.map((idea) => generateIdeaDoc(idea));

    res.render('ideas/index', {
        title: 'All Ideas',
        ideas: generateIdea,
    });
};

// Get Add Idea form
exports.new = (req, res) => {
    res.render('ideas/new', { title: 'Add New Idea' });
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
    const idea = new Idea({ ...req.body });
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
