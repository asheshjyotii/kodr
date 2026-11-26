const dbConnect = require('./src/config/db.config')
const app = require('./src/app')
require('dotenv').config()
require('./src/config/db.config')


const PORT = process.env.PORT || 3000

const startServer = async()=>{
    await dbConnect()
    app.listen(PORT,()=>{
    console.log(`server is running.... at ${PORT}`)
    })
     
}

startServer()
