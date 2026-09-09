const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Sign-up a new user (POST /api/auth/signup)
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body; 

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'A user with this email already exists' });
        }
        
        user = new User({
            name,
            email,
            password
        });
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(201).json({ message: 'User created Successfully!' });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// Existing user login (POST /api/auth/login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const payload = {
            userId: user._id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_key', {
            expiresIn: '1h'
        });

        console.log("login successfully");
        
        res.status(200).json({
            message: 'Logged in successfully',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST /api/auth/google
// @desc    Authenticate user with Google Sign-In
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;

        // 👈 Fixed typo: verigyIdToken -> verifyIdToken
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        // 👈 Fixed typo: getpayload -> getPayload
        const { name, email } = ticket.getPayload();
        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({
                name,
                email,
                password: hashedPassword
            });
            await user.save();
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_key', {
            expiresIn: '1h'
        });

        res.status(200).json({
            message: 'Google Login Successful',
            token: token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Google Auth Error :', error.message);
        res.status(500).json({ message: "Google authentication failed" });
    }
});

module.exports = router;