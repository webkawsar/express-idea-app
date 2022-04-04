const express = require('express');
const _ = require('lodash');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
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
app.get('/ideas/:id', async (req, res) => {
    try {
        const { id } = req.params;

        let idea = await Idea.findById(id);
        idea = generateIdeaDoc(idea);

        if (idea) {
            res.render('ideas/show', { title: idea.title, idea });
        } else {
            res.status(404).render('notFound', { title: 'Not found' });
        }
    } catch (error) {
        res.status(500).render('error');
    }
});

// Get edit idea form
app.get('/ideas/:id/edit', async (req, res) => {
    try {
        const { id } = req.params;
        let idea = await Idea.findById(id);
        idea = generateIdeaDoc(idea);

        if (idea) {
            res.render('ideas/edit', { title: idea.title, idea });
        } else {
            res.status(404).render('notFound', { title: 'Not found' });
        }
    } catch (error) {
        res.status(500).render('error');
    }
});

// create Idea
app.post('/ideas', async (req, res) => {
    try {
        const allowComments = !!req.body.allowComments;
        req.body.allowComments = allowComments;

        const idea = new Idea({ ...req.body });
        await idea.save();

        // redirect user
        res.redirect('/ideas');
    } catch (error) {
        res.status(500).render('error');
    }
});

// update idea
app.put('/ideas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const allowComments = !!req.body.allowComments;
        req.body.allowComments = allowComments;

        // update value
        const pickedValue = _.pick(req.body, ['title', 'description', 'status', 'allowComments']);
        const idea = await Idea.findByIdAndUpdate(id, pickedValue);

        if (idea) {
            res.redirect(`/ideas/${id}`);
        } else {
            res.status(404).render('notFound', { title: 'Not found' });
        }
    } catch (error) {
        res.status(500).render('error');
    }
});

// delete idea
app.delete('/ideas/:id', async (req, res) => {
    try {
        const { id } = req.params;
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
