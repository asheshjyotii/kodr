const express = require('express')
const {registerUser, loginUser} = require('../controllers/auth.controller')


const authRouter = express.Router()


// POST register
authRouter.post('/register',registerUser)


//login
authRouter.post('/login',loginUser)

module.exports = authRouter
