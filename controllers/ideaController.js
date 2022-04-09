const mongoose = require('mongoose');
const _ = require('lodash');
const Idea = require('../models/Idea');
const generateIdeaDoc = require('../helpers/ideaDoc');

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
    let idea = await Idea.findById(id);

    if (idea) {
        idea = generateIdeaDoc(idea);
        res.render('ideas/show', { title: idea.title, idea });
    } else {
        res.status(404).render('notFound', { title: 'Not found' });
    }
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

    // redirect user
    res.redirect('/ideas');
};

// update idea
exports.update = async (req, res) => {
    const { id } = req.params;
    // update value
    const pickedValue = _.pick(req.body, ['title', 'description', 'status', 'allowComments']);
    const idea = await Idea.findByIdAndUpdate(id, pickedValue);

    if (idea) {
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
        res.redirect('/ideas');
    } else {
        res.status(404).render('notFound', { title: 'Not found' });
    }
};
