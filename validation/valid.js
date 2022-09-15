const jwt = require('jsonwebtoken')
const Joi = require('joi')
const userdatas = require('../models/userModels')

const Validate = Joi.object({
    name: Joi.string().required().min(3),
    phone: Joi.number().required().min(1000000000).max(9999999999).error(new Error('Please enter a valid phone number')),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required().error(new Error('Please enter a valid Email ID')),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(new Error('Please enter a valid password'))

})


const signUp = async (req, res, next) => {
    try {

        await Validate.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            err.status = res.status(400).json({ status: 400, message: err.message || err })
        next(err)

    }
}

const validater = Joi.object({
    username: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required().error(new Error('Please enter a valid Email ID')),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(new Error('Please enter a valid password'))
})

const login = async (req, res, next) => {
    try {
        await validater.validateAsync({ ...req.body })
        next()
    } catch (err) {
        if (err)
            err.status = res.status(400).json({ status: 400, message: err.message || err })
        next(err)
    }
}

//token Auth
const tokenAuth = async (req, res, next) => {
    try {
        const token = await req.header("x-auth-token");
        if (!token) return res.status(403).json({ status: 403, message: "access denied no token provided" })
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN);
        console.log(decoded);
        req.man = await userdatas.findById(decoded._id);
        next();
    } catch (err) {
        if (err)
            err.status = res.status(403).json({ status: 403, message: err.message || err })
        next(err)

    }

}

//is ADMIN
const isAdmin = async (req, res, next) => {
    try {
        if (req.man.admin === false) {
            return next(res.status(401).send({ status: 401, message: "user not a admin" }));
        }
        next()
    } catch (err) {
        if (err)
            err.status = res.status(403).json({ status: 403, message: err.message || err })
        next(err)

    }

}

//product validation

const productValidation = Joi.object({
    productID: Joi.number().required(),
    productName: Joi.string().required().min(3),
    brand: Joi.string().required().min(3),
    model: Joi.number().required().max(9999999999).error(new Error('please enter valid model name')),
    category: Joi.string().required().min(3),
    price: Joi.number().required().max(9999999999).error(new Error('please enter valid price name')),
    date: Joi.string().required().min(3),
    color: Joi.string().required().min(3),
    qty: Joi.number().required().error(new Error('please enter valid qty name'))

})

const productValid = async (req, res, next) => {
    try {
        await productValidation.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            res.status(400).send({ status: 400, message: err.message || err })
        next(err)
    }
}


//valiidate coupons 
const couponsValidation = Joi.object({
    offerName: Joi.string().required().min(3),
    couponCode: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,14}$')).required().error(new Error('Please enter a valid couponCode')),
    startDate: Joi.string().required().error(new Error('please enter valid startDate')),
    endDate: Joi.string().required().error(new Error('please enter valid endDate')),
    type: Joi.string().required().valid("discount%", "amount").error(new Error('INVALID TYPE')),
    value: Joi.number().required().error(new Error('please enter valid value')),
    couponStatus: Joi.boolean()
})
const couponsValid = async (req, res, next) => {
    try {
        couponsValidation.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            res.status(400).send({ status: 400, message: err.message || err })
        next(err)
    }
}



module.exports = {
    signUp, login, tokenAuth, productValid, isAdmin, couponsValid
}








// orderData:  Joi.string().required().min(24)