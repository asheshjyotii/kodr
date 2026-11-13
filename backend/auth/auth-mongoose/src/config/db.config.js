const mongoose = require('mongoose')

const DB_URI = process.env.DB_URI

const dbConnect = async()=>{
    try{
        await mongoose.connect(DB_URI)
        console.log('db connected...');

    }
    catch(err){
        console.log('something went wrong in db',err);
        throw err
        
    }
    
}



module.exports = dbConnect