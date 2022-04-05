const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const { compareValues, truncateText } = require('./helpers');

// config
const connectDB = require('./config/db');
// routes
const ideasRoute = require('./routes/idea');

// Database connection
connectDB();

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
    res.render('pages/index', {
        title: 'Home Page',
        text: 'Hello Node.js Programmer',
    });
});

// ideas
app.use('/ideas', ideasRoute);

// about
app.get('/about', (req, res) => {
    res.render('pages/about', {
        title: 'About us',
        text: 'Know about us',
    });
});

// handle not found route
app.get('*', (req, res) => {
    res.status(404).render('notFound');
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).render('error');
});

// Server listening
app.listen(8080, () => {
    console.log('Server is listening on: 8080');
});
