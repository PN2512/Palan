const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(express.json());
app.use(cors());

console.log("Starting Palan backend server...");

app.use('/api/auth', authRoutes);
app.use('/api/pets',petRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });