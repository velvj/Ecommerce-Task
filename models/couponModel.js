const mongoose = require('mongoose')
const Schema = mongoose.Schema

const couponSchema = new Schema({
    offerName: { type: String },
    couponCode: { type: String, unique: true },
    startDate: { type: String },
    endDate: { type: String },
    type: { type: String },
    value: { type: Number },
    couponStatus: { type: Boolean, default: true },
}, {
    timestamps: true
})

const coupons = mongoose.model('coupons', couponSchema)

module.exports = coupons