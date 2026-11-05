// import using commonjs
const express = require('express');
const { log } = require('node:console');
const connectDb = require('./config/connectDb');

// create app

const app = express();


// middleware
app.use(express.json())

//create
app.post('/create',(req,res)=>{
    let details = req.body
    console.log(details)
    res.status(201).json({
        success: true,
        message: 'the user was created'
    })
})

//get 
app.get('/user',(req,res)=>{
    res.send("hellow user")
})


// delete
//app.delete()

//modify
//app.patch()
connectDb()


// turn the app on
app.listen(3000,()=>{
    console.log("server is running....")
})