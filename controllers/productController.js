const productData = require('../models/productModel')
// const csvdata = require('../simple.csv')
const csv = require('csvtojson')
const upload = require('../middleware/uploads')

// csv to json 

const csvlist = async (req, res) => {
    try {
        csv()
            .fromFile('simple.csv')
            .then(async (csvfile) => {
                // console.log(csvfile);
                await productData.insertMany(csvfile).then(function () {
                    console.log('data inserted');
                    res.status(200).json({ status: 200, success: `data inserted succesfully `, })
                })
            })
    } catch (err) {
        return res.status(400).send({ status: 400, message: err.message || err })

    }
}

//multer file uploads 

const addfile = async (req, res) => {
    try {
        upload.single('uploads')
            (req, res, async function (error) {
                if (error) {
                    return res.json({ error: "Error uploading file" })
                }
                let csvpath = req.file.path
                console.log(csvpath, "Aa");
                csv()
                    .fromFile(csvpath)
                    .then(async (csvfile) => {
                        csvfile.forEach(async (obj) => {
                            console.log(obj.productName);
                            const result = await productData.findOneAndUpdate({ productID: obj.productID },
                                {
                                    $set: {
                                        productName: obj.productName,
                                        brand: obj.brand,
                                        model: obj.model,
                                        category: obj.category,
                                        price: obj.price,
                                        date: obj.date,
                                        color: obj.color,
                                        qty: obj.qty
                                    }
                                }, { upsert: true, new: true })
                        })
                        res.status(200).json({ status: 200, success: `data inserted succesfully ` })
                    })
            })
    } catch (err) {
        return res.status(400).send({ status: 400, message: err.message || err })
    }
}
/*create products
udhay*/
const createProduct = async (req, res) => {
    try {
        let product = new productData({
            productID: req.body.productID,
            productName: req.body.productName,
            brand: req.body.brand,
            model: req.body.model,
            category: req.body.category,
            price: req.body.price,
            date: req.body.date,
            color: req.body.color,
            qty: req.body.qty
        })
        const products = await product.save();
        return res.status(200).send({ status: 200, message: "product created successfully", data: products })
    }
    catch (err) {
        if (err.code && err.code == 11000) {
            return res.status(400).json({ status: 400, message: "Already exists product!" });
        }
        res.status(400).json({ status: 400, message: err.message || err });
    }
}

const getproudctlist = async (req, res) => {
    try {
        let products = await productData.find().sort({ createdAt: -1 }).select(['-createdAt', '-updatedAt', '-__v'])
        res.status(200).send({ status: 200, message: "products listed", data: products })
    } catch (err) {
        return res.status(400).send({ status: 400, message: err.message || err })
    }
}

const getbyid = async (req, res) => {
    try {
        let getproduct = await productData.findById(req.params.id)
        if (!req.params.id) {
            return res.status(400).json({ error: "no id found" })
        }
        res.status(200).send({ status: 200, message: "get product by id succesfully", data: getproduct })
    } catch (err) {
        res.status(400).send({ status: 400, message: err.message || err })
    }

}

const updateProduct = async (req, res) => {
    try {
        const editProduct = await productData.findOneAndUpdate({ _id: req.params.id },
            {
                $set: {
                    productID: req.body.productID,
                    productName: req.body.productName,
                    brand: req.body.brand,
                    model: req.body.model,
                    category: req.body.category,
                    price: req.body.price,
                    date: req.body.date,
                    color: req.body.color,
                    qty: req.body.qty
                }
            }, { new: true });

        return res.status(400).json({ status: 200, message: "product updated succesfully", data: editProduct })
    } catch (err) {
        res.status(400).send({ status: 400, message: err.message || err })
    }

}

const deleteproduct = async (req, res) => {
    try {
        let delproduct = productData.deleteOne(req.params.id)
        if (!req.params.id) { return res.status(400).json({ error: "no id found" }) }
        res.status(200).send({ status: 200, message: "product deleted successfully", data: delproduct })
    } catch (err) {
        res.status(400).send({ status: 400, message: err.message || err })
    }
}





module.exports = { createProduct, getproudctlist, updateProduct, getbyid, deleteproduct, csvlist, addfile }






// var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName[0]]);

//         for (let i = 0; i < xlData.length; i++) {
//             if (!xlData[i]._id) {
//                 product.create(xlData[i]);
//             } else {
//                 const productExist = await product.findById(xlData[i]._id);

//                 if (!(JSON.stringify(productExist) === JSON.stringify(xlData[i]))) {
//                     await product.updateOne({ _id: xlData[i]._id }, { $set: xlData[i] }, { new: true });
//                 }
//             }
//         }