import mongoose, { mongo } from 'mongoose'
import { log } from 'node:console'


const dbConnect = async ():Promise<void>=>{
    try {
        console.log("inside try");
        
        const DB_URL:string | undefined = process.env.DB_URL 


        console.log(DB_URL)
        if (typeof(DB_URL)=="string") {
            await mongoose.connect(DB_URL)
            console.log('✅database connected successfully');
            
        }
        
        
    } catch (error) {
        throw new Error(`Database connection failed dalle harshit....${error}`)
    }
}

export default dbConnect