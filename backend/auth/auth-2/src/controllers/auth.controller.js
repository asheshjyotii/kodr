const bcrypt = require('bcrypt')
const userModel = require('../model/auth.model')
const { default: mongoose } = require('mongoose')
const jwt = require('jsonwebtoken')
require('../model/auth.model')


const registerUser = async(req,res)=>{
    const {name,email,password} = req.body


    //validation
    if(!name||!email||!password){
        return res.status(400).json({
            success:false,
            message:"User details not valid",
            data:{name,email}
        })
    }
    
    // hash password
    const hashedPassword = await bcrypt.hash(password,Number(process.env.SALT))
    console.log(hashedPassword)

    // add user to database
    try{
        await userModel.create({
            name,
            email,
            password:hashedPassword
        })
        res.status(201).json({
            success:true,
            message:'successfully created user at database...',
            data:{name,email}
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:'user not created',
            data:{name,email}
        })
        console.log('user not created',err)
    }

}

const loginUser = async(req,res)=>{
    const {email,password} = req.body

    // check if email exists
    const user = await userModel.findOne({
        email: email
    })

    if(!user){
        return res.status(401).json({
            success:false,
            message:'user not found',
            data:{email}
        })
    }


    // validate password
    const isPasswordCorrect = await bcrypt.compare(password,user.password)

    if(!isPasswordCorrect){
        return res.status(401).json({
            success:false,
            message:'email or password mismatch'
        })
    }

    // token genration

    const generateToken = (user)=>{
        const payload = {
            userId:user._id,
            emailId:user.email
        }
        const option = {
            expiresIn:'1h'
        }

        return jwt.sign(payload,process.env.SECRET,option)
    }

    const token = generateToken(user)


    res.status(200).json({
        status:true,
        message:'You are successfully loggedin.',
        data:{
            name:user.name,
            email:user.email,
            token
        }

    })
}

module.exports = {registerUser,loginUser}