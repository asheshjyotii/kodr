const connectDb = require('./src/config/db.config')
const app = require('./src/app')

const startApp = async ()=>{
    await connectDb()
    app.listen(3000,()=>{
    console.log('server started....')
})
}

startApp()