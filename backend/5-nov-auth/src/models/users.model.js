const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true,
        min:10
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },

})

const User = mongoose.model('Users', UserSchema)

module.exports = User