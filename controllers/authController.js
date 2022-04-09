const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const asyncMiddleware = require('../middleware/asyncMiddleware');

exports.new = (req, res) => {
    res.render('auth/register', { title: 'Register for sharing your idea' });
};

// create user
exports.create = asyncMiddleware(async (req, res) => {
    const user = new User({ ...req.body });
    await user.save();

    // redirect to dashboard
    res.redirect('/ideas');
});

exports.loginForm = (req, res) => {
    res.render('auth/login', { title: 'Login for sharing your idea' });
};

exports.login = asyncMiddleware(async (req, res) => {
    // find email exists or not
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        // if exists check password
        const isMatch = await bcryptjs.compare(req.body.password, user.password);
        if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/ideas');
        } else {
            res.render('auth/login', {
                title: 'Login for sharing your idea',
                errMsg: 'Invalid email or password',
            });
        }
    } else {
        res.render('auth/login', {
            title: 'Login for sharing your idea',
            errMsg: 'Invalid email or password',
        });
    }
});

// Log out
exports.logout = asyncMiddleware(async (req, res) => {
    await req.session.destroy();
    res.redirect('/auth/login');
});
