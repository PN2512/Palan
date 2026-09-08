
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust if your User model path is different
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token." });
    }
};

// GET User Profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE User Profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId, 
            { name: req.body.name }, 
            { new: true }
        ).select('-password');
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;