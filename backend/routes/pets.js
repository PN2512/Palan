const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/' , auth , async (req , res)=>{
    try{
        const {name , species , age} =req.body;

        const newPet = new Pet({
            name,
            species,
            age,
            ownerId : req.user.userId
        });

        const savedPet = await newPet.save();

        await User.findByIdAndUpdate(req.user.userId ,{
            $push:{pets : savedPet._id}
        });
        res.status(201).json(savedPet);
    }catch(error){
        console.error('Error adding pet:', error.message);
        res.status(500).json({message:"Server error while adding pet"});
    }
});

router.get('/',auth,async(req,res)=>{
    try{
        const pets = await Pet.find({ownerId:req.user.userId}).sort({createdAt:-1});
        res.status(200).json(pets);
    }
    catch(error){
        console.error('Error fetching pets:', error.message);
        res.status(500).json({message:"Server error while fetching pets"});
    }
});
router.delete('/:id',auth , async(req,res) =>{
    try{
        const pet = await Pet.findOneAndDelete({_id: req.params.id, owerId: req.user.userId});
        if(!pet) return res.status(404).json({message:'Pet not found'});

        await User.findByIdAndUpdate(req.user.userId,{$pull:{pets:pet._id }});

        res.status(200).json({message:'Pet deleted successfully'});

    }catch(error){
        console.error('Error deleteing pet :',error,message);
        res.status(500),json({message:'Server error while deleting pet'});
    }
});

module.exports = router;