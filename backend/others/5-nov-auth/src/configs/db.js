const mongoose = require('mongoose')

const db = async ()=>{
    try {
        await mongoose.connect('mongodb+srv://aishasarkar186_db_user:T14EytVBKx2xZdFf@auth.sd9ckzf.mongodb.net/')
        console.log('db connected....');
        
        
    } catch (error) {
        console.log('something went wrong in db',error);
        
        
    }
}

module.exports = db