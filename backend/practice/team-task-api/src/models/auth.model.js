const mongo = require('mongoose')



const UserSchema = new mongo.Schema({
    name:String,
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["employee", "admin", "manager"],
        default:"employee"
    },
    avatar:String,
    isActive:{
        type:Boolean,
        default:true

    }
})

const UserModel = mongo.model("users",UserSchema)

module.exports = UserModel