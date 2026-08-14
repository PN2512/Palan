const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const authRoutes= require('./routes/auth')

// MIDDLEWARE 
app.use(cors());
app.use(express.json()); // ALLOWS US TO READ JSON DATA FROM REACT
app.use('/api/auth',authRoutes);

// CONNECT TO MONGODB ATLAS

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Successfully connected to mongoDB Atlas"))
.catch((err)=>console.error('MongoDB connection error:',err));

//A simple test route
app.get('/',(req,res)=>{
    res.send('pets Tracker API is running!');
});

// Start the server

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
});