const express = require('express');

const router = express.Router();
const {
    ideaValidator,
    addIdeaValidationResult,
    editValidationResult,
} = require('../middleware/validators/ideaValidator');
const checkIdeaOwnership = require('../middleware/checkIdeaOwnership');

// Controller
const ideaController = require('../controllers/ideaController');
// middleware
const protect = require('../middleware/protect');
const ajaxProtect = require('../middleware/ajaxProtect');

// Get All Ideas
router.get('/', ideaController.getAll);

// Get Add Idea form
router.get('/new', protect, ideaController.new);

// Get Single Idea
router.get('/:id', ideaController.getSingle);
// get idea like comment count
router.get('/:id/likes', ideaController.likeCount);
router.get('/:id/comments', ideaController.commentCount);

// Get edit idea form
router.get('/:id/edit', [protect, checkIdeaOwnership], ideaController.edit);

// create Idea
router.post('/', [protect, ideaValidator, addIdeaValidationResult], ideaController.create);

// like idea
router.post('/:id/likes', ajaxProtect, ideaController.toggleLike);

// update idea
router.put(
    '/:id',
    [protect, checkIdeaOwnership, ideaValidator, editValidationResult],
    ideaController.update
);

// delete idea
router.delete('/:id', [protect, checkIdeaOwnership], ideaController.delete);

module.exports = router;
