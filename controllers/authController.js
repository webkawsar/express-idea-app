const _ = require('lodash');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const { mailgun, registerData, forgetData } = require('../config/mailConfig');

exports.new = (req, res) => {
    res.render('auth/register', { title: 'Register for sharing your idea' });
};

// create user
exports.create = asyncMiddleware(async (req, res) => {
    const pickedValue = _.pick(req.body, ['firstName', 'lastName', 'email', 'password']);
    const user = new User(pickedValue);
    await user.save();
    const token = await jwt.sign(
        {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isVerified: false,
        },
        process.env.ACCOUNT_ACTIVATION_SECRET,
        { expiresIn: '5m' }
    );
    await mailgun.messages().send(registerData(user.email, token));

    req.flash('success_msg', 'Please check your email and activate account');
    // redirect to dashboard
    res.redirect('/auth/register');
});

/**
 * @desc
 * @route
 * @access
 *
 *
 */
exports.activate = async (req, res) => {
    const { token } = req.params;
    // eslint-disable-next-line consistent-return
    jwt.verify(token, process.env.ACCOUNT_ACTIVATION_SECRET, async (error, decoded) => {
        if (error) {
            req.flash('error_msg', 'Account activation failed.Please try again register');
            return res.redirect('/auth/register');
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
            req.flash('success_msg', 'Account activate successfully.Please login');
            return res.redirect('/auth/login');
        }

        req.flash('error_msg', 'Account already activate.Please login');
        res.redirect('/auth/login');
    });
};

exports.loginForm = (req, res) => {
    res.render('auth/login', { title: 'Login for sharing your idea' });
};

exports.login = async (req, res) => {
    req.flash('success_msg', 'Login successful');
    res.redirect('/ideas');
};

// Log out
exports.logout = asyncMiddleware((req, res) => {
    req.logout();
    req.flash('success_msg', 'Logout successful');
    res.redirect('/auth/login');
});

/**
 * @params:
 * @access: public
 * @route: { GET } /auth/forget-password
 * @desc: A forget password form
 *
 */
exports.forgetForm = (req, res) => {
    res.render('auth/forget-password', {
        title: 'Forget Password',
    });
};

/*
 * @params:
 * @access: public
 * @route: { POST } /auth/forget-password
 * @desc: A forget password control
 *
 */
// eslint-disable-next-line consistent-return
exports.forget = async (req, res) => {
    const token = jwt.sign(
        {
            firstName: req.forgetUser.firstName,
            lastName: req.forgetUser.lastName,
            email: req.forgetUser.email,
        },
        process.env.FORGET_SECRET,
        { expiresIn: '5m' }
    );

    req.forgetUser.isToken = token;
    await req.forgetUser.save({ validateBeforeSave: false });

    await mailgun.messages().send(forgetData(req.forgetUser.email, token));
    req.flash(
        'success_msg',
        'Reset password link was sent to your email.Please follow the instructions'
    );
    res.redirect('/auth/forget-password');
};

/*
 * @params:
 * @access:
 * @route: { GET } /auth/reset-password
 * @desc: verify token and Show a reset password form
 *
 */

exports.resetForm = (req, res) => {
    const { token } = req.params;
    // eslint-disable-next-line consistent-return
    jwt.verify(token, process.env.FORGET_SECRET, async (error, decoded) => {
        if (error) {
            // console.log(error);
            req.flash('error_msg', 'Password reset Failed.Please try again');
            return res.redirect('/auth/forget-password');
        }

        const user = await User.findOne({ email: decoded.email, isToken: token });
        if (!user) {
            req.flash('error_msg', 'Password reset Failed.Please try again');
            return res.redirect('/auth/forget-password');
        }

        res.render('auth/reset-password', {
            title: 'Reset Password',
            email: decoded.email,
            token,
        });
    });
};

exports.reset = (req, res) => {
    // eslint-disable-next-line consistent-return
    jwt.verify(req.body.token, process.env.FORGET_SECRET, async (error, decoded) => {
        if (error) {
            // console.log(error);
            req.flash('error_msg', 'Password reset Failed.Please try again');
            return res.redirect('/auth/forget-password');
        }

        const user = await User.findOne({ email: decoded.email, isToken: req.body.token });
        if (!user) {
            req.flash('error_msg', 'Password reset Failed.Please try again');
            return res.redirect('/auth/forget-password');
        }

        user.isToken = undefined;
        user.password = req.body.password;
        await user.save();
        req.flash('success_msg', 'Reset password successfully.Please login');
        res.redirect('/auth/login');
    });
};
