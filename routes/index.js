const express = require('express');

const router = express.Router();
const checkGuest = require('../middleware/checkGuest');

// Root route
router.get('/', checkGuest, (req, res) => {
    res.render('pages/index', {
        title: 'Home Page',
        text: 'Share Idea for better Future',
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
    res.status(404).render('notFound', { title: 'Not Found' });
});

module.exports = router;
