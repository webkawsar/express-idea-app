const express = require('express');

const router = express.Router({
    mergeParams: true,
});
const commentController = require('../controllers/commentController');
const {
    addCommentValidator,
    addCommentValidationResult,
} = require('../middleware/validators/commentValidator');
const protect = require('../middleware/protect');

// path
router.get('/new', protect, commentController.new);
router.post(
    '/',
    [protect, addCommentValidator, addCommentValidationResult],
    commentController.create
);
router.delete('/:commentId', protect, commentController.delete);

module.exports = router;
