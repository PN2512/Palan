const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ silent: true });

const app = express();

// 1. Critical CORS configuration to allow Authorization headers from your frontend
const allowedOrigins = [
    'http://localhost:5173',
    'https://palan-pet-care-app.vercel.app' // Add your live Vercel domain here!
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
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