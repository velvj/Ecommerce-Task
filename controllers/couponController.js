const couponsData = require('../models/couponModel')



//create coupon

const createCoupon = async (req, res) => {
    try {
        const couponData = new couponsData({
            offerName: req.body.offerName,
            couponCode: req.body.couponCode,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            type: req.body.type,
            value: req.body.value,
            couponStatus: req.body.couponStatus
        })
        let coupons = await couponData.save()
        // const mydata = await couponsData.populate(coupons,{path:'orderData'})
        return res.status(200).send({ status: 200, message: "coupon created succesfully", data: coupons })
    } catch (erorr) {
        res.status(400).send({ status: 400, message: erorr.message || erorr })
    }
}






//get coupons

const getcoupon = async (req, res) => {
    try {

        const myData = await couponsData.find()
        res.status(200).send({ status: 200, message: "coupon datas", data: myData })
    }
    catch (erorr) {
        res.status(400).send({ status: 400, message: erorr.message || erorr })
    }
}


//getBy id coupons

const getbyID = async (req, res) => {
    try {
        // if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        //     return res.status(400).json({ status: 400, message: "coupon is not valid" })
        // }
        const id = req.params.id
        const mydata = await couponsData.findById({ _id: id })
        const lastDate = new Date(mydata.endDate);
        let currentDate = new Date(); // new Date().getTime() returns value in number
        console.log(lastDate, currentDate,"dates"); // endDate number > currentDate number
if(currentDate > lastDate){
   return res.status(200).send({status:200,message:"Date is expired",data:`${lastDate} nxt ${currentDate}`})
}else{
    return res.status(200).send({status:200,message:"date not expired",data:`Valid till ${lastDate}`})
}
        // res.status(200).send({status:200,message:"date testing",data:`${lastDate} nxt ${currentDate}`})

        // if (mydata.couponCode.match(/^[!@#\$%\^\&*\)\(+=._-]{3,14}$/)) {
        //     return res.status(400).send({ status: 400, message: "Invalid Coupon Code" })
        // }
        // else
        //     return res.status(200).send({ status: 200, message: "Coupon Data", data: mydata })
    }
    catch (erorr) {
        res.status(400).send({ status: 400, message: erorr.message })
    }
}

//update coupon

const updateCoupon = async (req, res) => {
    try {
        const editCoupon = await couponsData.findOneAndUpdate({ _id: req.params.id },
            {
                $set: {
                    offerName: req.body.offerName,
                    couponCode: req.body.couponCode,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    type: req.body.type,
                    value: req.body.value,
                    couponStatus: req.body.couponStatus


                }
            }, { new: true });

        return res.status(400).json({ status: 200, message: "coupon updated succesfully", data: editCoupon })
    } catch (err) {
        res.status(400).send({ status: 400, message: err.message || err })
    }

}

//delete coupon

const deleteCoupon = async (req, res) => {
    try {
        let delcoupon = couponsData.deleteOne(req.params.id)
        if (!req.params.id) { return res.status(400).json({ error: "no id found" }) }
        res.status(200).send({ status: 200, message: "product deleted successfully", data: delcoupon })
    } catch (err) {
        res.status(400).send({ status: 400, message: err.message || err })
    }
}


//find aggregate


const getCoupons = async (req, res) => {
    try {
        const myData = await couponsData.aggregate([{
            $match: {}
        }])
        const count = await couponsData.countDocuments()
        res.status(200).send({ status: 200, message: "coupon datas", data: myData, count: count })
    } catch (erorr) {
        res.status(400).send({ status: 400, message: erorr.message || erorr })
    }
}






module.exports = { createCoupon, getcoupon, getbyID, updateCoupon, deleteCoupon, getCoupons }

 //     if (data.couponStatus === true) {

    //         // if(!data.couponCode.match(/^[0-9a-zA-Z]{4}$/)) {
    //         // if(!data.startDate.match(/^\W$/)){
    //         if (data.type === "discount%") {
    //             var getDiscount = data.orderData.totalAmount - (data.orderData.totalAmount * data.value / 100);

    //             let final = { data, finalAmount: getDiscount, discounted: data.orderData.totalAmount - getDiscount }
    //             // console.log(final)
    //             return res.status(200).send({ status: 200, message: "Discount Percentage Data", data: final })
    //         }
    //         else if (data.type === "amount") {
    //             let getamount = data.orderData.totalAmount - data.value;
    //             // console.log(getamount)
    //             let final = await { data, finalAmount: getamount, discounted: data.orderData.totalAmount - getamount }
    //             // console.log(getamount - data.orderData.totalAmount)
    //             return res.status(200).send({ status: 200, message: "Amount Data", data: final })
    //         }
    //         // }else{
    //         //        return res.status(400).send({ status: 400, message: "start Date is NOT Valid " })
    //         //      }
    //         // }else{
    //         //    return res.status(400).send({ status: 400, message: "Coupon Code is NOT Valid " })
    //         // }
    //     } else {
    //         return res.status(400).send({ status: 400, message: "Coupon ID is EXPIRED / INVALID" })
    //     }
    // return res.status(200).send({ status: 200, message: "Amount Data", data: mydata })



