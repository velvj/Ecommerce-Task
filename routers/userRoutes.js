const validate = require('../validation/valid')
const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/userController')

router.post('/registration', validate.signUp, AuthController.registration)
router.post('/logedin', validate.login, AuthController.logedin)
router.get('/getUserlist', validate.tokenAuth, AuthController.getUserlist)


module.exports = router