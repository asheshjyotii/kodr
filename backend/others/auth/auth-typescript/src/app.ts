import express, {Application, Request, Response} from 'express'
import dbConnect from './config/db.config'


const app:Application = express()

dbConnect()
app.get('/',(req:Request,res:Response)=>{
    res.json({
        message:'from typescript server'
    })
})

export default app