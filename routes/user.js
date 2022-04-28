const express = require('express');
const multer = require('multer');

const router = express.Router();

// dependency
const userController = require('../controllers/userController');
const protect = require('../middleware/protect');
const {
    profileValidator,
    profileValidationResult,
} = require('../middleware/validators/profileValidator');

const upload = multer({}).single('profile_pic');

router.get('/me', protect, userController.me);
router.get('/me/edit', protect, userController.editForm);
router.put(
    '/me',
    [protect, upload, profileValidator, profileValidationResult],
    userController.update
);
router.get('/me/ideas', protect, userController.getMyIdeas);
router.get('/:id/ideas', userController.getIdeas);
router.delete('/me', protect, userController.delete);

module.exports = router;
