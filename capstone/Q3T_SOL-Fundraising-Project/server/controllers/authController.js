// controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' }); // Short-lived token
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); // Longer-lived token
};

// @route   POST /api/auth/signup
const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ name, email, password });
        await user.save();

        const token = generateAccessToken(user._id);

        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @route   POST /api/auth/signin
const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate access and refresh tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Optionally, you can store the refresh token in the database (if desired)
        user.refreshToken = refreshToken;
        await user.save();

        // Send tokens as response
        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

const refreshToken = (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(403).json({ message: 'Refresh token is required' });
    }

    // Verify the refresh token
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken({ _id: user.id });
        res.json({ accessToken: newAccessToken });
    });
};


module.exports = { signup, signin, refreshToken };
