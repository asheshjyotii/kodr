const express = require('express')
const authRouter = require('./routes/auth.routes')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()


// POST register

app.use(express.json())

app.use('/api/auth',authRouter)


app.use(errorMiddleware)

module.exports = app