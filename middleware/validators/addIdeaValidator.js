const { check, validationResult } = require('express-validator');

const addIdeaValidator = [
    check('title')
        .notEmpty()
        .withMessage('Title is required')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Please provide title between 3 to 30 char'),

    check('description')
        .notEmpty()
        .withMessage('Description is required')
        .trim()
        .isLength({ min: 10, max: 10000 })
        .withMessage('Please provide description between 3 to 10000 char'),

    check('status')
        .notEmpty()
        .withMessage('Please select status')
        .isIn(['public', 'private'])
        .withMessage('Please select status public or private'),
];

// eslint-disable-next-line consistent-return
const addIdeaValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    const allowComments = !!req.body.allowComments;
    req.body.allowComments = allowComments;

    if (!errors.isEmpty()) {
        const ideaInput = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments,
        };
        return res.render('ideas/new', {
            title: 'Add New Idea',
            idea: ideaInput,
            errMsg: errors.array()[0].msg,
        });
    }
    next();
};

module.exports = {
    addIdeaValidator,
    addIdeaValidationResult,
};
