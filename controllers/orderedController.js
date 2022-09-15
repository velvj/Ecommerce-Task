const orderDatas = require('../models/orderedModel')
const Users = require('../models/userModels')

const createOrder = async (req, res) => {
  try {
    const order = new orderDatas({
      customer: req.body.customer,
      orderItems: req.body.orderItems,
      shippingAddress: {
        address: req.body.shippingAddress.address,
        city: req.body.shippingAddress.city,
        postalCode: req.body.shippingAddress.postalCode,
        country: req.body.shippingAddress.country
      },
      totalAmount: req.body.totalAmount,
      created: req.body.created,
      date: req.body.date,
      couponID: req.body.couponID
    })

    let createdOrder = await order.save()
    let output = await orderDatas.populate(createdOrder, { path: "couponID" })
    return res.status(200).send({ status: 200, message: "order created successfully", data: output })
  } catch (err) {
    res.status(400).send({ status: 400, message: err.message || err })
  }
}

//find All Order Details

const getorder = async (req, res) => {
  try {
    let o = {}
    if (req.query.search) {
      o = { name: req.query.search }
      let customerId = await Users.find(o).select('_id')
      o = { customer: { $in: customerId.map(x => x._id) } }
    }
    else if (!req.query.search) {
      let k = await orderDatas.find().sort({ createdAt: -1 }).populate('customer', "name email phone _id").populate('orderItems', "productName brand color model qty category price date  _id").populate('couponID')
      return res.status(200).send({ status: 200, message: "order listed successfully", data: k })
    }
    const listdata = await orderDatas.find(o).populate('customer', "name email phone _id").populate('orderItems.product', "productName brand color model qty category price date  _id")
    return res.status(200).send({ status: 200, message: "order listed successfully", data: listdata })
  } catch (err) {
    res.status(400).send({ status: 400, message: err.message || err })
  }
}

//get by id
const getID = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ status: 400, message: "Order ID not found" })
    }
    let getproduct = await orderDatas.findById({ _id: req.params.id })
    if (!getproduct.couponID) {
      return res.status(200).send({ status: 200, message: "Discount Percentage Data", data: getproduct })
    } else {
      let getproduct = await orderDatas.findById({ _id: req.params.id }).populate("couponID")
      const lastDate = new Date(getproduct.couponID.endDate);
      let currentDate = new Date(); 
      if((lastDate >= currentDate) && (getproduct.couponID.couponStatus))
       {
         if (getproduct.couponID.type === "discount%") {
          var getDiscount = getproduct.totalAmount - (getproduct.totalAmount * getproduct.couponID.value / 100);
          let final = { getproduct, finalAmount: getDiscount, discounted: getproduct.totalAmount - getDiscount }
          return res.status(200).send({ status: 200, message: "Discount Percentage Data", data: final })
        }
        else if (getproduct.couponID.type === "amount") {
          let getamount = getproduct.totalAmount - getproduct.couponID.value;
          let final = await { getproduct, finalAmount: getamount, discounted: getproduct.totalAmount - getamount }
          return res.status(200).send({ status: 200, message: "get order by id succesfully", data: final })
        }
      }else{
        return res.status(200).send({ status: 200, message: "Date is expired" })
      }
    }
  } catch (err) {
    res.status(400).send({ status: 400, message: err.message || err })
  }

}

//sorting
const getsorting = async (req, res) => {
  try {
    const placedorder = await orderDatas.find({}).sort({ createdAt: -1 }).populate('customer', "name email phone -_id").populate('orderItems.product', "productName brand color model qty category price date -_id")
    return res.status(200).send({ status: 200, message: "order listed successfully", data: placedorder })
  } catch (err) {
    res.status(400).send({ status: 400, message: err.message || err })
  }
}


const getdate = async (req, res) => {
  try {
    // console.log(orderDatas);
    let search = req.query.search


    if (search) {
      const orderdata = await orderDatas.find({ date: { $regex: search } }).populate('customer', "name email phone -_id").populate('orderItems', "productName brand color model qty category price date  -_id")
      res.status(200).json({ status: 200, message: "success", data: orderdata });
    }

  } catch (err) {
    res.status(400).send({ status: 400, message: err.message || err })
  }
}

// Api to list customers based on the number of products purchased.

const listorder = async (req, res) => {
  try {
    if (req.query.search) {
      const namedata = await orderDatas.find({}).populate('customer', "name email phone ").populate('orderItems', "productName brand color model qty category price date ")
      let datalist = namedata.filter(({ customer }) => customer.includes(req.query.search))
      return res.status(200).send({ status: 200, message: "order   listed use of name successfully", data: datalist })
    }

  } catch (err) {
    res.status(400).send({ status: 400, message: err.message || err })
  }
}

//update order
const updateOrder = async (req, res) => {
  try {
    const editOrder = await orderDatas.findOneAndUpdate({ _id: req.params.id },
      {
        $set: {
          customer: req.body.customer,
          orderItems: req.body.orderItems,
          shippingAddress: {
            address: req.body.shippingAddress.address,
            city: req.body.shippingAddress.city,
            postalCode: req.body.shippingAddress.postalCode,
            country: req.body.shippingAddress.country
          },
          totalAmount: req.body.totalAmount,
          created: req.body.created,
          date: req.body.date,
          couponID: req.body.couponID
        }
      }, { new: true });

    return res.status(400).json({ status: 200, message: "order updated succesfully", data: editOrder })
  } catch (err) {
    res.status(400).send({ status: 400, message: err.message || err })
  }

}

//delete Order by id

const deleteOrder = async (req, res) => {
  try {
    let delOrder = orderDatas.deleteOne(req.params.id)
    if (!req.params.id) { return res.status(400).json({ error: "no id found" }) }
    res.status(200).send({ status: 200, message: "product deleted successfully", data: delOrder })
  } catch (err) {
    res.status(400).send({ status: 400, message: err.message || err })
  }
}
module.exports = { createOrder, getorder, getsorting, getdate, listorder, getID, updateOrder, deleteOrder }







