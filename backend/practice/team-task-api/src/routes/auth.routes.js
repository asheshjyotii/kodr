const express = require('express')
const router = express.Router()
const {register, login, logout, refresh, me, changePassword} = require('../controllers/auth.controller')


router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refresh)
router.post('/me', me)
router.post('/change-password', changePassword)


module.exports = router
