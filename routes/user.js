const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// dependency
const userController = require('../controllers/userController');
const protect = require('../middleware/protect');
const {
    profileValidator,
    profileValidationResult,
} = require('../middleware/validators/profileValidator');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const jpeg = file.mimetype === 'image/jpeg';
    const jpg = file.mimetype === 'image/jpg';
    const png = file.mimetype === 'image/png';

    if (jpeg || jpg || png) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    // storage,
    // fileFilter,
    // limits: {
    //     fileSize: 1000000,
    // },
}).single('profile_pic');

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
