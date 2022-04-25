const { check, validationResult } = require('express-validator');

const ideaValidator = [
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
        .trim()
        .notEmpty()
        .withMessage('Please select status')
        .isIn(['public', 'private'])
        .withMessage('Please select status public or private'),

    check('category', 'Please select category').trim().notEmpty(),

    // check('idea_img', 'Please select Idea image').notEmpty(),
    check('idea_img').custom((value, { req }) => {
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

    check('idea_img').custom((value, { req }) => {
        const { file } = req;
        if (file) {
            if (file.size > 2000000) {
                throw new Error('File less than 2mb is allowed');
            }
            return true;
        }
        return true;
    }),

    check('tags')
        .trim()
        .notEmpty()
        .withMessage('Idea tag is required')
        .isLength({ min: 1 })
        .withMessage('Idea must have one tag'),
];

// eslint-disable-next-line consistent-return
const addIdeaValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    const allowComments = !!req.body.allowComments;
    req.body.allowComments = allowComments;
    const tags = req.body?.tags?.split(',');
    req.body.tags = tags;

    if (!errors.isEmpty()) {
        const ideaInput = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments,
            tags: req.body.tags,
            category: req.body.category,
        };
        return res.render('ideas/new', {
            title: 'Add New Idea',
            idea: ideaInput,
            errMsg: errors.array()[0].msg,
        });
    }
    next();
};

// edit idea validator
// eslint-disable-next-line consistent-return
const editValidationResult = (req, res, next) => {
    const { id } = req.params;
    const allowComments = !!req.body.allowComments;
    req.body.allowComments = allowComments;
    const tags = req.body?.tags?.split(',');
    req.body.tags = tags;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const ideaInput = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments,
            _id: id,
            tags: req.body.tags,
        };
        return res.render('ideas/edit', {
            title: 'Update Idea',
            idea: ideaInput,
            errMsg: errors.array()[0].msg,
        });
    }

    next();
};

module.exports = {
    ideaValidator,
    addIdeaValidationResult,
    editValidationResult,
};
