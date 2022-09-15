const Coupons = require('../controllers/couponController')
const express = require('express')
const Router = express.Router()
const validator = require('../validation/valid')


Router.post('/createCoupon', validator.tokenAuth, validator.isAdmin, validator.couponsValid, Coupons.createCoupon)
Router.get('/getcoupon', validator.tokenAuth, validator.isAdmin, Coupons.getcoupon)
Router.get('/getbyID/:id', validator.tokenAuth, validator.isAdmin, Coupons.getbyID)
Router.put('/updateCoupon/:id', validator.tokenAuth, validator.isAdmin, Coupons.updateCoupon)
Router.delete('/deleteCoupon/:id', validator.tokenAuth, validator.isAdmin, Coupons.updateCoupon)

//aggregate 
Router.get('/getCoupons', validator.tokenAuth, validator.isAdmin, Coupons.getCoupons)


module.exports = Router

