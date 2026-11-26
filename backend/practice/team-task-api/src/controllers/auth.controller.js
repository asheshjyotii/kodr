const { config } = require("dotenv");
const UserModel = require("../models/auth.model")
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser');
const generateTokens = require("../utils/generateTokens");


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const register= async (req,res)=>{
    // 1.get user details
    const {name, email, password, role, avatar} = req.body
     
    // 2.validation
    // required:
    if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message:"Please enter all data correctly"    
        })
    }
    //email sanitisation
    sanitizedEmail = email.trim().toLowerCase
    
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"Enter valid email"
        })
    }
    if(!password.length >= 8){
        return res.status(400).json({
            success:false,
            message:"Password must be greater than 8."
        })
    }

    // 3. check if user already exists
    const user = await UserModel.findOne({email})
    console.log("USER",user)
    
    if(user){
        return res.status(409).json({
            success:false,
            message:"the email already exists."
        })
    }

    // 4. file upload TODO

    // 5. hash password
    const hashedPassword = bcrypt.hashSync(password,Number(process.env.SALT))

    // 6. Create user in db
    try {
        await UserModel.create({
        name,
        email,
        password:hashedPassword,
        role,
        avatar

    })
    res.status(201).json({
        success:true,
        message:"User created successfully",
        data:{
            name,
            email,
            role
        }
    })
        
    } catch (error) {
        res.stats(500).json({
            success:false,
            message:"Internal server error, user not created"
        })
        
    }
    


    
}

const login= async (req,res)=>{
    // 1. get credentials
    const {email, password} = req.body

    // 2. validate data
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please enter all details"
        })
    }

    // 3. Find user in DB
    try {
        const user = await UserModel.findOne({email})

    if(!user){
        return res.status(401).json({
            success:false,
            message:"User is not registered, please register account first"
        })
    }
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })
        
    }
    

    // 4. compare password
    const passCorrect = await bcrypt.compare(password,user.password)
    if(!passCorrect){
        res.status(401).json({
            success:false,
            message:"Invalid email or password"
        })
    }

    // 5. Generate token
    const {accessToken, refreshToken}=generateTokens(user._id)
    
    // 6. set cookies
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"login succefull",
        data:{
            accessToken
        }
    })

}

const logout=(req,res)=>{
    res.send("logout")
}

const refresh=(req,res)=>{
    res.send("refresh")
}

const me=(req,res)=>{
    res.send("me")
}

const changePassword=(req,res)=>{
    res.send("changePassword")
}

module.exports = {register, login, logout, refresh, me, changePassword}