const mongoose = require('mongoose')


const dbConnect = async()=>{
    try{
        console.log('███░░ 50% | connecting to database.......')
        await mongoose.connect(process.env.DB_URL)
        console.log('✅ database connected successfully.')
    }
    catch(err){
        console.log('database connection failed....')
    }

}

module.exports = dbConnect