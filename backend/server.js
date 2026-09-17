const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Critical CORS configuration to allow Authorization headers from your frontend
app.use(cors({
    origin: 'http://localhost:5173', // Change to 'http://localhost:3000' if your React app runs on port 3000
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// 2. Body parser middleware to handle JSON requests
app.use(express.json());

// 3. Connect to MongoDB Atlas (or local database)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/palan';
mongoose.connect(MONGO_URI)
    .then(() => console.log('🟢 MongoDB Connected Successfully'))
    .catch((err) => console.error('🔴 MongoDB Connection Error:', err.message));

// 4. Register your API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/tasks', require('./routes/tasks'));

// 5. Root endpoint test
app.get('/', (req, res) => {
    res.send('Palan API is running successfully!');
});

// 6. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});