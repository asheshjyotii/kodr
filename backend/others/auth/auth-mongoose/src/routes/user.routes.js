const express = require('express')

const router = express.Router()
const createUser = require('../controllers/auth.controllers')


router.post('/register',createUser)

module.exports = router