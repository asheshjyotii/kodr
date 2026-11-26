const mongoose = require('mongoose')


const NoteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const Notes = mongoose.model('Notes',NoteSchema)


module.exports = Notes