const bcrypt = require('bcrypt')
const User = require('../model/user.model')


const createUser = async(req,res)=>{
//  console.log("route reached");
 
    try{
        const {name, email, password} = req.body
        if(!name || !email|| !password){
            res.status(400).json({
                success:false,
                message:'User data not valid',
                data:{name,email,password}
            })
        }
        const hashedPass = await bcrypt.hash(password,Number(process.env.SALT_ROUND))
        // console.log(hashedPass)

        await User.create({name,email,password: hashedPass})
        console.log('user created')


        return res.status(201).json({
            success:true,
            message:"User create successfully",
            data:{
                name: name,
                email: email
            }
        })
    }
    
    catch(err){
        console.log('Error',err)
        return res.status(500).json({
            success:false,
            message:"Something went wrong, user not created"
        })
        
    }


}


module.exports = createUser