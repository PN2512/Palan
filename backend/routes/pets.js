const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/' , auth , async (req , res)=>{
    try{
        const {name , species , age} = req.body;

        const newPet = new Pet({
            name: name,
            species: species,
            age: age,
            ownerId: req.user.userId
        });

        const savedPet = await newPet.save();

        await User.findByIdAndUpdate(req.user.userId ,{
            $push:{pets : savedPet._id}
        });
        
        // Only send the response ONCE at the very end!
        res.status(201).json(savedPet);
    }catch(error){
        console.error('Error adding pet:', error.message);
        res.status(500).json({message:"Server error while adding pet"});
    }
});

router.get('/', auth, async(req, res) => {
    try {
        // 👇 ADD THIS LINE TO SEE WHAT YOUR TOKEN HOLDS!
        console.log("DEBUG: My user payload is:", req.user); 

        const pets = await Pet.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(pets);
    }
    catch(error) {
        console.error('Error fetching pets:', error.message);
        res.status(500).json({ message: "Server error while fetching pets" });
    }
});

router.delete('/:id',auth , async(req,res) =>{
    try{
        // Fixed typo: owerId -> ownerId
        const pet = await Pet.findOneAndDelete({_id: req.params.id, ownerId: req.user.userId});
        if(!pet) return res.status(404).json({message:'Pet not found'});

        await User.findByIdAndUpdate(req.user.userId,{$pull:{pets:pet._id }});

        res.status(200).json({message:'Pet deleted successfully'});

    }catch(error){
        // Fixed typos: error,message -> error.message AND res.status(500),json -> res.status(500).json
        console.error('Error deleting pet :', error.message);
        res.status(500).json({message:'Server error while deleting pet'});
    }
});

module.exports = router;