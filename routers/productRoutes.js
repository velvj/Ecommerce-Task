const express = require('express')
const validator = require('../validation/valid')
const productrouter = express.Router()
const productControl = require('../controllers/productController')




productrouter.post('/createProduct', validator.tokenAuth, productControl.createProduct)
productrouter.get('/getproductlist', validator.tokenAuth, validator.isAdmin, productControl.getproudctlist)
productrouter.get('/getbyid/:id', productControl.getbyid)
productrouter.delete('/deleteproduct/:id', productControl.deleteproduct)
productrouter.put('/editProducts/:id', productControl.updateProduct)
productrouter.post('/csvlist', productControl.csvlist)
productrouter.post('/addfile', productControl.addfile)




module.exports = productrouter