const mongo = require('mongoose')


const UserSchema = new mongo.Schema({
    username:String,
    password:String
})


const userModel = mongo.model('users',UserSchema)

module.exports = userModel