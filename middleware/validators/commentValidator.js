const { check, validationResult } = require('express-validator');
const Idea = require('../../models/Idea');
const generateIdeaDoc = require('../../helpers/ideaDoc');

const addCommentValidator = [
    check('title')
        .trim()
        .notEmpty()
        .withMessage('Comment title is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Comment title must be between 3 to 100 characters'),

    check('text')
        .trim()
        .notEmpty()
        .withMessage('Comment text is required')
        .isLength({ min: 3, max: 1000 })
        .withMessage('Comment text must be between 3 to 1000 characters'),
];

// eslint-disable-next-line consistent-return
const addCommentValidationResult = async (req, res, next) => {
    const errors = validationResult(req);
    const { id } = req.params;

    const idea = await Idea.findById(id);
    if (!idea) return res.status(404).render('notFound', { title: 'Not found' });

    if (!errors.isEmpty()) {
        const comment = {
            title: req.body?.title,
            text: req.body?.text,
        };
        return res.render('comments/new', {
            title: 'Add a new Comment',
            comment,
            idea: generateIdeaDoc(idea),
            errMsg: errors.array()[0].msg,
        });
    }
    next();
};

module.exports = {
    addCommentValidator,
    addCommentValidationResult,
};
