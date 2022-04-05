const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const generateIdeaDoc = require('../helpers/ideaDoc');

const router = express.Router();
const {
    addIdeaValidator,
    addIdeaValidationResult,
} = require('../middleware/validators/addIdeaValidator');
const {
    editIdeaValidator,
    editValidationResult,
} = require('../middleware/validators/editIdeaValidator');
const asyncMiddleware = require('../middleware/asyncMiddleware');

// Models
const Idea = require('../models/Idea');

// Get All Ideas
router.get(
    '/',
    asyncMiddleware(async (req, res) => {
        const ideas = await Idea.find();
        const generateIdea = ideas.map((idea) => generateIdeaDoc(idea));

        res.render('ideas/index', {
            title: 'All Ideas',
            ideas: generateIdea,
        });
    })
);

// Get Add Idea form
router.get('/new', (req, res) => {
    res.render('ideas/new', { title: 'Add New Idea' });
});

// Get Single Idea
router.get(
    '/:id',
    // eslint-disable-next-line consistent-return
    asyncMiddleware(async (req, res) => {
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
    })
);

// Get edit idea form
router.get(
    '/:id/edit',
    // eslint-disable-next-line consistent-return
    asyncMiddleware(async (req, res) => {
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
    })
);

// create Idea
router.post(
    '/',
    addIdeaValidator,
    addIdeaValidationResult,
    asyncMiddleware(async (req, res) => {
        const idea = new Idea({ ...req.body });
        await idea.save();

        // redirect user
        res.redirect('/ideas');
    })
);

// update idea
router.put(
    '/:id',
    editIdeaValidator,
    editValidationResult,
    asyncMiddleware(async (req, res) => {
        const { id } = req.params;
        // update value
        const pickedValue = _.pick(req.body, ['title', 'description', 'status', 'allowComments']);
        const idea = await Idea.findByIdAndUpdate(id, pickedValue);

        if (idea) {
            res.redirect(`/ideas/${id}`);
        } else {
            res.status(404).render('notFound', { title: 'Not found' });
        }
    })
);

// delete idea
router.delete(
    '/:id',
    // eslint-disable-next-line consistent-return
    asyncMiddleware(async (req, res) => {
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
    })
);

module.exports = router;
