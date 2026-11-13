const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name:{
        required:true,
        maxlength:[
            30,
            'The name length exceeds the max'
        ],
        type:String,
        
    },
    email:{
        required:true,
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        
    },
    password:{
        required:true,
        type:String,
        
    }
})

const Usermodel = mongoose.model('users',UserSchema)
console.log(Usermodel);



module.exports = Usermodel