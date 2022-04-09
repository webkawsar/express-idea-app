const User = require('../models/User');
const asyncMiddleware = require('../middleware/asyncMiddleware');

exports.new = (req, res) => {
    res.render('auth/register', { title: 'Register for sharing your idea' });
};

// create user
exports.create = asyncMiddleware(async (req, res) => {
    const user = new User({ ...req.body });
    await user.save();

    req.flash('success_msg', 'Registration successful');
    // redirect to dashboard
    res.redirect('/auth/login');
});

exports.loginForm = (req, res) => {
    res.render('auth/login', { title: 'Login for sharing your idea' });
};

exports.login = (req, res) => {
    req.flash('success_msg', 'Login successful');
    res.redirect('/ideas');
};

// Log out
exports.logout = asyncMiddleware((req, res) => {
    req.logout();
    req.flash('success_msg', 'Logout successful');
    res.redirect('/auth/login');
});
