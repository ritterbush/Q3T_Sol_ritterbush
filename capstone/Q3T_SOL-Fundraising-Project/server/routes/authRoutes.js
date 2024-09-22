// routes/authRoutes.js
const express = require('express');
const { check } = require('express-validator');
const { signup, signin, refreshToken } = require('../controllers/authController');

const router = express.Router();

// Signup route
router.post(
    '/signup',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    signup
);

// Signin route
router.post(
    '/signin',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    signin
);


router.post('/refresh', refreshToken);

module.exports = router;
