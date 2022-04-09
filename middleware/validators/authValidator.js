const { check, validationResult } = require('express-validator');
const User = require('../../models/user');

const registerValidator = [
    check('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .trim()
        .isLength({ max: 10, min: 3 })
        .withMessage('First name must be between 3 to 10 char'),

    check('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .trim()
        .isLength({ max: 10, min: 3 })
        .withMessage('Last name must be between 3 to 10 char'),

    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please add valid email')
        .trim()
        .normalizeEmail(),

    check('email').custom(async (email) => {
        const user = await User.findOne({ email });
        if (user) {
            throw new Error('Email is already registered!');
        } else {
            return true;
        }
    }),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .trim()
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be between 6 to 20 char')
        .not()
        .isIn(['abc123', 'password', 'iloveyou'])
        .withMessage("Password can't set common word or text"),

    check('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .trim()
        .custom((confirmPassword, { req }) => {
            if (confirmPassword === req.body.password) {
                return true;
            }
            throw new Error("Password doesn't match");
        }),
];

// eslint-disable-next-line consistent-return
const registerValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const userInput = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        };
        return res.render('auth/register', {
            title: 'Register for sharing your idea',
            userInput,
            errMsg: errors.array()[0].msg,
        });
    }
    next();
};

const loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please add valid email')
        .trim(),

    check('password').notEmpty().withMessage('Password is required').trim(),
];

// eslint-disable-next-line consistent-return
const loginValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('auth/login', {
            title: 'Login for sharing your idea',
            errMsg: errors.array()[0].msg,
        });
    }
    next();
};

module.exports = {
    registerValidator,
    registerValidationResult,
    loginValidator,
    loginValidationResult,
};
