const express =require('express');
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Sign-up a new user(POST /api / auth /signup)
router.post('/signup',async(req,res)=>{
    try{
        const {name,email,password} = req.body; 

        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:'A user with this email already exists'});

        }
        user =new User({
            name,
            email,
            password
        });
        const salt = await bcrypt.genSalt(10);
        user.password =await bcrypt.hash(password,salt);

        await user.save();

        res.status(201).json({message:'User created Successfully!'});
    }catch(error){
        console.error('Signup error:',error.message);
        res.status(500).json({message:'Server error during signup'});
    }

})

// Existing user(PORT / api/auth/login)
router.post('/login',async(req,res)=>{
    // VERIFICATION LOGIC GOES HERE
    try{
        const {email,password} = req.body;
         // 1. Check if the user exists 
         const user = await User.findOne({email });
         if(!user){
            return res.status(400).json({message:'Invalid email or password'});
         }
         // 2. Check if the password matches
         const isMatch =await bcrypt.compare(password,user.password);
         if(!isMatch){
            return res.status(400).json({message:'Invalid email or password'})

         }

         // 3. Generate a JWT token
         const payload ={
            userId : user._id
         };

         const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_key',{
            expiresIn:'1h'
         });

         // 4. Send the token back to frontend
         res.status(200).json({
            message:'Logged in successfully',
            token:token 
         });

    }catch(error){
        console.error('Login error:',error.message);
        res.status(500).json({message:'Server error during login'});

    }
});
module.exports=router