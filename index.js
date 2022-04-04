const express = require('express');
const _ = require('lodash');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const { compareValues, truncateText } = require('./helpers');

// Schema
const Idea = require('./models/Idea');

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/idea-app');
        console.log('Database is connected');
    } catch (error) {
        console.log(`Database connection error: ${error.message}`);
    }
};

connectDB();

// Handle handlebars problem
// eslint-disable-next-line object-curly-newline
const generateIdeaDoc = ({ title, description, allowComments, status, _id }) => ({
    title,
    description,
    allowComments,
    status,
    _id,
});

// App object
const app = express();

// app.engine('handlebars', exphbs);
app.engine('.hbs', exphbs({ extname: '.hbs', helpers: { compareValues, truncateText } }));
app.set('view engine', '.hbs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));

// Routing
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        text: 'Hello Node.js Programmer',
    });
});

// Get All Ideas
app.get('/ideas', async (req, res) => {
    try {
        const ideas = await Idea.find();
        const generateIdea = ideas.map((idea) => generateIdeaDoc(idea));

        res.render('ideas/index', {
            title: 'All Ideas',
            ideas: generateIdea,
        });
    } catch (error) {
        res.status(500).render('error');
    }
});

// Get Add Idea form
app.get('/ideas/new', (req, res) => {
    res.render('ideas/new', { title: 'Add New Idea' });
});

// Get Single Idea
// eslint-disable-next-line consistent-return
app.get('/ideas/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).render('notFound', { title: 'Not found' });
    }

    try {
        let idea = await Idea.findById(id);

        if (idea) {
            idea = generateIdeaDoc(idea);
            res.render('ideas/show', { title: idea.title, idea });
        } else {
            res.status(404).render('notFound', { title: 'Not found' });
        }
    } catch (error) {
        res.status(500).render('error');
    }
});

// Get edit idea form
// eslint-disable-next-line consistent-return
app.get('/ideas/:id/edit', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).render('notFound', { title: 'Not found' });
    }

    try {
        let idea = await Idea.findById(id);
        if (idea) {
            idea = generateIdeaDoc(idea);
            res.render('ideas/edit', { title: idea.title, idea });
        } else {
            res.status(404).render('notFound', { title: 'Not found' });
        }
    } catch (error) {
        res.status(500).render('error');
    }
});

// create Idea
app.post(
    '/ideas',
    check('title')
        .notEmpty()
        .withMessage('Title is required')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Please provide title between 3 to 30 char'),

    check('description')
        .notEmpty()
        .withMessage('Description is required')
        .trim()
        .isLength({ min: 3, max: 10000 })
        .withMessage('Please provide description between 3 to 10000 char'),

    check('status')
        .notEmpty()
        .withMessage('Please select status')
        .isIn(['public', 'private'])
        .withMessage('Please select status public or private'),

    // eslint-disable-next-line consistent-return
    async (req, res) => {
        const errors = validationResult(req);
        const allowComments = !!req.body.allowComments;

        if (!errors.isEmpty()) {
            const ideaInput = {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                allowComments,
            };
            return res.render('ideas/new', {
                title: 'Add New Idea',
                idea: ideaInput,
                errMsg: errors.array()[0].msg,
            });
        }

        try {
            req.body.allowComments = allowComments;
            const idea = new Idea({ ...req.body });
            await idea.save();

            // redirect user
            res.redirect('/ideas');
        } catch (error) {
            console.log(error.message);
            res.status(500).render('error');
        }
        // eslint-disable-next-line comma-dangle
    }
);

// update idea
app.put(
    '/ideas/:id',
    [
        check('title')
            .notEmpty()
            .withMessage('Title is required')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('Please provide title between 3 to 30 char'),

        check('description')
            .notEmpty()
            .withMessage('Description is required')
            .trim()
            .isLength({ min: 3, max: 10000 })
            .withMessage('Please provide description between 3 to 10000 char'),

        check('status')
            .notEmpty()
            .withMessage('Please select status')
            .isIn(['public', 'private'])
            .withMessage('Please select status public or private'),
    ],
    // eslint-disable-next-line consistent-return
    async (req, res) => {
        const { id } = req.params;
        const allowComments = !!req.body.allowComments;
        req.body.allowComments = allowComments;

        // update value
        const pickedValue = _.pick(req.body, ['title', 'description', 'status', 'allowComments']);

        const errors = validationResult(req);
        console.log(errors.array(), 'errors.array()');

        if (!errors.isEmpty()) {
            const ideaInput = {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                allowComments,
                _id: id,
            };
            return res.render('ideas/edit', {
                title: 'Update Idea',
                idea: ideaInput,
                errMsg: errors.array()[0].msg,
            });
        }

        try {
            const idea = await Idea.findByIdAndUpdate(id, pickedValue);

            if (idea) {
                res.redirect(`/ideas/${id}`);
            } else {
                res.status(404).render('notFound', { title: 'Not found' });
            }
        } catch (error) {
            res.status(500).render('error');
        }
        // eslint-disable-next-line prettier/prettier
    },
);

// delete idea
// eslint-disable-next-line consistent-return
app.delete('/ideas/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).render('notFound', { title: 'Not found' });
    }

    try {
        const idea = await Idea.findByIdAndDelete(id);

        if (idea) {
            res.redirect('/ideas');
        } else {
            res.status(404).render('notFound', { title: 'Not found' });
        }
    } catch (error) {
        res.status(500).render('error');
    }
});

// about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About us',
        text: 'Know about us',
    });
});

// handle not found route
app.get('*', (req, res) => {
    res.render('notFound');
});

// Server listening
app.listen(8080, () => {
    console.log('Server is listening on: 8080');
});
