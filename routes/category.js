const express = require('express');

const router = express.Router();
// controller
const categoryController = require('../controllers/categoryController');
// middleware
const isAdmin = require('../middleware/isAdmin');
const protect = require('../middleware/protect');

// validators
const {
    addCategoryValidator,
    addCategoryValidationResult,
} = require('../middleware/validators/categoryValidator');

router.get('/new', [protect, isAdmin], categoryController.new);
router.post(
    '/',
    [protect, isAdmin, addCategoryValidator, addCategoryValidationResult],
    categoryController.create
);
router.get('/', [protect, isAdmin], categoryController.getAll);
router.get('/:id/ideas', categoryController.getIdeas);
router.delete('/:catName', [protect, isAdmin], categoryController.delete);

module.exports = router;
