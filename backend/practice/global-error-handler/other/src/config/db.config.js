const mongo = require('mongoose')


const connectDb = async ()=>{
    await mongo.connect('mongodb+srv://aishasarkar186_db_user:T14EytVBKx2xZdFf@auth.sd9ckzf.mongodb.net/')
    console.log("db connected....")

}

module.exports = connectDb