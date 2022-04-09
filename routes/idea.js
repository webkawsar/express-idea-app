const express = require('express');

const router = express.Router();
const {
    addIdeaValidator,
    addIdeaValidationResult,
} = require('../middleware/validators/addIdeaValidator');
const {
    editIdeaValidator,
    editValidationResult,
} = require('../middleware/validators/editIdeaValidator');

// Controller
const ideaController = require('../controllers/ideaController');
// middleware
const protect = require('../middleware/protect');

// Get All Ideas
router.get('/', ideaController.getAll);

// Get Add Idea form
router.get('/new', protect, ideaController.new);

// Get Single Idea
router.get('/:id', ideaController.getSingle);

// Get edit idea form
router.get('/:id/edit', protect, ideaController.edit);

// create Idea
router.post('/', protect, addIdeaValidator, addIdeaValidationResult, ideaController.create);

// update idea
router.put('/:id', protect, editIdeaValidator, editValidationResult, ideaController.update);

// delete idea
router.delete('/:id', protect, ideaController.delete);

module.exports = router;
