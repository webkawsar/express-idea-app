const express = require('express');
const _ = require('lodash');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const { compareValues, truncateText } = require('./helpers');

// App object
const app = express();

// app.engine('handlebars', exphbs);
app.engine('.hbs', exphbs({ extname: '.hbs', helpers: { compareValues, truncateText } }));
app.set('view engine', '.hbs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));

let ideas = [
    {
        id: 1,
        title: 'Sample Idea 1',
        description: 'Sample Idea Description',
        status: 'private',
        allowComments: true,
    },
    {
        id: 2,
        title: 'Sample Idea 2',
        description: 'Sample Idea 2 Description',
        status: 'public',
        allowComments: false,
    },
    {
        id: 3,
        title: 'Sample Idea 3',
        description: 'Sample Idea 3 Description',
        status: 'public',
        allowComments: true,
    },
];

// Routing
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        text: 'Hello Node.js Programmer',
    });
});

// Get All Ideas
app.get('/ideas', (req, res) => {
    res.render('ideas/index', {
        title: 'All Ideas',
        ideas,
    });
});

// Get Add Idea form
app.get('/ideas/new', (req, res) => {
    res.render('ideas/new', { title: 'Add New Idea' });
});

// Get Single Idea
app.get('/ideas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idea = ideas.find((singleIdea) => singleIdea.id === id);

    if (idea) {
        res.render('ideas/show', { title: idea.title, idea });
    } else {
        res.render('notFound', { title: 'Not found' });
    }
});

// Get edit idea form
app.get('/ideas/:id/edit', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idea = ideas.find((singleIdea) => singleIdea.id === id);

    if (idea) {
        res.render('ideas/edit', { title: idea.title, idea });
    } else {
        res.render('notFound', { title: 'Not found' });
    }
});

// create Idea
app.post('/ideas', (req, res) => {
    const allowComments = !!req.body.allowComments;
    const idea = { ...req.body, allowComments, id: ideas.length + 1 };
    ideas.push(idea);

    // redirect user
    res.redirect('/ideas');
});

// update idea
app.put('/ideas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const findIdea = ideas.find((singleIdea) => singleIdea.id === id);

    if (findIdea) {
        // update idea
        const pickedValue = _.pick(req.body, ['title', 'description', 'status', 'allowComments']);
        const updateIdea = { id, ...pickedValue };
        ideas = ideas.map((idea) => (idea.id === id ? (idea = updateIdea) : idea));
        res.redirect(`/ideas/${id}`);
    } else {
        res.render('notFound', { title: 'Not found' });
    }
});

// delete idea
app.delete('/ideas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idea = ideas.find((singleIdea) => singleIdea.id === id);

    if (idea) {
        ideas = ideas.filter((singleIdea) => singleIdea.id !== id);
        res.redirect('/ideas');
    } else {
        res.render('notFound', { title: 'Not found' });
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
