const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/pets - Add a new pet
router.post('/', auth, async (req, res) => {
    try {
        const { name, species, age } = req.body;

        const newPet = new Pet({
            name: name,
            species: species,
            age: age,
            ownerId: req.user.userId // Linked via the JWT token payload
        });

        const savedPet = await newPet.save();

        // Push the pet reference into the user's pets array
        await User.findByIdAndUpdate(req.user.userId, {
            $push: { pets: savedPet._id }
        });
        
        res.status(201).json(savedPet);
    } catch (error) {
        console.error('Error adding pet:', error.message);
        res.status(500).json({ message: "Server error while adding pet" });
    }
});

// GET /api/pets - Fetch all pets for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const pets = await Pet.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(pets);
    } catch (error) {
        console.error('Error fetching pets:', error.message);
        res.status(500).json({ message: "Server error while fetching pets" });
    }
});

// DELETE /api/pets/:id - Delete a specific pet
router.delete('/:id', auth, async (req, res) => {
    try {
        const pet = await Pet.findOneAndDelete({ _id: req.params.id, ownerId: req.user.userId });
        if (!pet) return res.status(404).json({ message: 'Pet not found' });

        await User.findByIdAndUpdate(req.user.userId, { $pull: { pets: pet._id } });

        res.status(200).json({ message: 'Pet deleted successfully' });
    } catch (error) {
        console.error('Error deleting pet:', error.message);
        res.status(500).json({ message: 'Server error while deleting pet' });
    }
});

module.exports = router;