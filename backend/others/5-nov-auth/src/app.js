const express = require('express')
const db = require('./configs/db')
const User = require('./models/users.model')
const app = express()

app.use(express.json())

db()
 
app.post('/register',(req,res)=>{
    let {name,email,password,mobile} = req.body;
    

    // check if email already exists
    const userExists = await User.findOne({email})
    
    if(!userExists){
        User.create({name,email,password,mobile})
        res.send('user created.....')
    }
    res.send('user already exists....')
})


module.exports = app