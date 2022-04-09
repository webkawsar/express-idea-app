const express = require('express');
const passport = require('passport');

const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
// validators
const {
    registerValidator,
    registerValidationResult,
    loginValidator,
    loginValidationResult,
} = require('../middleware/validators/authValidator');
const protect = require('../middleware/protect');

// routes
router.get('/register', authController.new);
router.post('/register', registerValidator, registerValidationResult, authController.create);

router.get('/login', authController.loginForm);
// router.post('/login', loginValidator, loginValidationResult, authController.login);
router.post(
    '/login',
    loginValidator,
    loginValidationResult,
    passport.authenticate('local', {
        failureRedirect: '/auth/login',
    }),
    authController.login
);

router.get('/logout', protect, authController.logout);

module.exports = router;
