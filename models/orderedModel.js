const mongoose = require('mongoose')
const schema = mongoose.Schema

const orderSchema = new schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'userdatas',
  },
  orderItems: {
    type: Array,
    required: true,
    ref: 'productsdatas'
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0.0,
  },
  created: { type: Date, default: Date.now },
  date: { type: String },
  couponID: { type: mongoose.Schema.Types.ObjectId, ref: 'coupons' }
},
  { timestamps: { createdAt: true } }
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order