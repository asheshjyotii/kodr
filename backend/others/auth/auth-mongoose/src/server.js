const app = require('./app')
require('dotenv').config()
const dbConnect = require('./config/db.config') 

const PORT = process.env.PORT



const startServer = async()=>{
    try{
        await dbConnect()
        
        app.listen(PORT,()=>{
            console.log(`server is running...${PORT}`);
            
        })
    }
    catch(err){
        console.log('server startup failed...',err);
        process.exit(1);
        
    }
}
startServer() 