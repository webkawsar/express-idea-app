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
    forgetValidator,
    forgetValidationResult,
    resetValidator,
    resetValidationResult,
} = require('../middleware/validators/authValidator');
const protect = require('../middleware/protect');
const isGuest = require('../middleware/isGuest');

// routes
router.get('/register', isGuest, authController.new);
router.post('/register', registerValidator, registerValidationResult, authController.create);

// account activation
router.get('/activate/:token', authController.activate);

// Passport local
router.get('/login', isGuest, authController.loginForm);
router.post(
    '/login',
    loginValidator,
    loginValidationResult,
    passport.authenticate('local', {
        failureRedirect: '/auth/login',
        failureFlash: true,
    }),
    authController.login
);

// Passport Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/login',
        failureFlash: true,
    }),
    authController.login
);

// logout
router.get('/logout', protect, authController.logout);

// forget password
router.get('/forget-password', authController.forgetForm);
router.post('/forget-password', [forgetValidator, forgetValidationResult], authController.forget);

// reset password
router.get('/reset-password/:token', authController.resetForm);
router.post('/reset-password', [resetValidator, resetValidationResult], authController.reset);

module.exports = router;
