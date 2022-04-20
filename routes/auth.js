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
const checkGuest = require('../middleware/checkGuest');

// routes
router.get('/register', checkGuest, authController.new);
router.post('/register', registerValidator, registerValidationResult, authController.create);

// Passport local
router.get('/login', checkGuest, authController.loginForm);
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

module.exports = router;
