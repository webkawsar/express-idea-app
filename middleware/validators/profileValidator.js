const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

const profileValidator = [
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

    check('profile_pic').custom((value, { req }) => {
        const { file } = req;
        if (file) {
            // do
            const jpeg = file.mimetype === 'image/jpeg';
            const jpg = file.mimetype === 'image/jpg';
            const png = file.mimetype === 'image/png';

            if (!jpeg || jpg || png) {
                throw new Error('Only jpeg, jpg, png image is allowed');
            }
            return true;
        }
        return true;
    }),

    check('profile_pic').custom((value, { req }) => {
        const { file } = req;
        if (file) {
            if (file.size > 1000000) {
                throw new Error('File less than 1mb is allowed');
            }
            return true;
        }
        return true;
    }),
];

// eslint-disable-next-line consistent-return
const profileValidationResult = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).render('notFound', { title: 'Not Found' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const userInput = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        };
        return res.render('users/edit-profile', {
            title: `Edit profile of ${user.firstName}`,
            userInput,
            errMsg: errors.array()[0].msg,
            path: '/users/me',
        });
    }
    next();
};

module.exports = {
    profileValidator,
    profileValidationResult,
};
