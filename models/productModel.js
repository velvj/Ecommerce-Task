const mongoose = require('mongoose')
const schema = mongoose.Schema

const productSchema = new schema({
    productID: { type: Number },
    productName: { type: String },
    brand: { type: String },
    model: { type: Number },
    category: { type: String },
    price: { type: Number },
    date: { type: String },
    color: { type: String },
    qty: { type: Number, default: 1 }

}, { timestamps: true })

const productsdatas = mongoose.model("productsdatas", productSchema)

module.exports = productsdatas