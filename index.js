const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
require("dotenv").config()
const authroute = require('./routers/userRoutes')
const productroute = require('./routers/productRoutes')
const orderrouter = require('./routers/orderedRoutes')
const couponrouter = require('./routers/couponRoutes')
mongoose.connect(process.env.DB_DATAS)

const db = mongoose.connection

db.on("error", (err) => {
    console.log(err);
})

db.once('open', () => {
    console.log('database is connected successfully');
})

app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: false, limit: '20mb' }))
app.use(morgan("dev"))
app.use('/users', authroute)
app.use('/products', productroute)
app.use('/orders', orderrouter)
app.use('/coupons', couponrouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`server running on ${PORT}`))




// app.use(express.json())
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.urlencoded({extended:true}))

// app.use("/uploadfiles",express.static('uploadfiles'))