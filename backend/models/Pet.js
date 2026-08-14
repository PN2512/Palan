const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true    
    },
    species:{
        type:String,
        default:'Cat' // Sets the default to feline
    },
    ownerId:{
        type:mongoose.Schema.types.ObjectId,
        ref:'User',
        required:true // A pet must be attactched to a human account    
        },
        routineLogs:[{
            actionTriggered:String, // "Refilled water bowl","fed denner"
            voiceCommandUsed:String,// "log dinner time"
            timestamp:{
                type:Date,
                default:Date.now
            }
        }]

},{timestamps:true})

module.exports= mongoose.model('Pet',petSchema);