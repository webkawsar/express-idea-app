const { check, validationResult } = require('express-validator');
const Category = require('../../models/Category');

const addCategoryValidator = [
    check('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('Category must be between 3 to 20 characters'),

    check('category').custom(async (category) => {
        const foundCategory = await Category.findOne({ category });
        if (foundCategory) {
            throw new Error('Category already exists!');
        } else {
            return true;
        }
    }),
];

// eslint-disable-next-line consistent-return
const addCategoryValidationResult = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).send({ success: false, message: errors.array()[0].msg });
    }
    next();
};

module.exports = {
    addCategoryValidator,
    addCategoryValidationResult,
};
