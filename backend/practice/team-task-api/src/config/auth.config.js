const mongo = require('mongoose')




const connectDB = async ()=>{
    try {
        await mongo.connect(process.env.DB_URI)
    console.log("DB connected...")
        
    } catch (error) {
        console.log('something went wrong in db',error)
        
    }
    
}

module.exports = connectDB