const connectDB = require('./src/config/auth.config')
const app = require('./src/app')
require('dotenv').config()

const PORT = process.env.PORT
const startServer = async ()=>{
    await connectDB()
    app.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`)
})
}

startServer()