const express = require('express')
const mongoose = require('mongoose')
const Notes = require('./models/notes.models')

app = express()


const db = async ()=>{
    try{
        await mongoose.connect('mongodb+srv://aishasarkar186_db_user:T14EytVBKx2xZdFf@auth.sd9ckzf.mongodb.net/')
        console.log('db connected....')
    }
    catch(err){
        console.log('error in db',err)
    }
}

db()

app.use(express.json())


app.post('/notes',async (req,res)=>{
    let {title, description} = req.body

    try{
        let data = await Notes.create({title,description})
        return res.status(201).json({
            suscess:true,
            message:'the record was successfully created',
            data:data
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'something went wrong in the server'
        })
    }
})

module.exports = app