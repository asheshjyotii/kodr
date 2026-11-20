const userModel = require("../models/auth.models")
const AppError = require("../utils/AppError")



const registerUser = async (req,res)=>{
    const {username, password} = req.body

    if (!username || !password){
        throw new AppError("required fields are not met",400)
    }
    
    const user = await userModel.create({username,password});

    res.status(201).json({
        message:"User is created"
    })
}

const loginUser = (req,res)=>{
    res.send('login route')
}

module.exports = {registerUser, loginUser};