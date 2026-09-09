const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    time: { type: String, required: true },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);