const express = require('express');

const router = express.Router();

// Root route
router.get('/', (req, res) => {
    res.render('pages/index', {
        title: 'Home Page',
        text: 'Hello Node.js Programmer',
    });
});

// about
router.get('/about', (req, res) => {
    res.render('pages/about', {
        title: 'About us',
        text: 'Know about us',
    });
});

// handle not found route
router.get('*', (req, res) => {
    res.status(404).render('notFound');
});

module.exports = router;
