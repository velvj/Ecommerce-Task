const express = require('express')
const orderrouter = express.Router()
const ordercontrol = require('../controllers/orderedController')
const validator = require('../validation/valid')


orderrouter.post('/createOrder', validator.tokenAuth, ordercontrol.createOrder)
orderrouter.get('/getorder', validator.tokenAuth, ordercontrol.getorder)
orderrouter.get('/getID/:id', validator.tokenAuth, ordercontrol.getID)
orderrouter.get('/getsorting', ordercontrol.getsorting)
orderrouter.get('/getdate', ordercontrol.getdate)
orderrouter.get('/listorder', ordercontrol.listorder)
orderrouter.get('/updateOrder/:id', validator.tokenAuth, ordercontrol.updateOrder)
orderrouter.get('/deleteOrder/:id', ordercontrol.deleteOrder)

module.exports = orderrouter