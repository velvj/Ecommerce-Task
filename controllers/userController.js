const UsersDatas = require('../models/userModels')
const bcrypt = require('bcryptjs')

//registration users
const registration = async (req, res) => {
    try {
        const hashing = await bcrypt.hash(req.body.password, 10)
        let Users = new UsersDatas({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashing
        })
        let userdata = await Users.save();
        res.status(200).send({ status: 200, message: "data saved succesfully", data: userdata })
    }
    catch (err) {
        if (err.code && err.code == 11000) {
            return res.status(400).json({ status: 400, message: "Already exists user!" });
        }
        res.status(400).json({ status: 400, message: err.message || err });
    }
}

//login users
const logedin = async (req, res) => {
    try {
        var username = req.body.username
        var password = req.body.password
        const user = await UsersDatas.findOne({ $or: [{ email: username }] })
        if (user) {
            const result = await bcrypt.compare(password, user.password)
            if (result) {
                let token = user.generateToken();
                const datas = { "name": user.name, "email": user.email, "phone": user.phone, "token": token };
                return res.header("x-auth-token", token).status(200).json({ status: 200, message: 'login succesfully', data: datas })
            }
        }
        else {
            return res.json("incorrect password")
        }
    }
    catch (error) {
        return res.status(400).json({ status: 400, message: error.message || error });
    }
}

//get user list 
const getUserlist = async (req, res) => {
    try {
        let listdata = await UsersDatas.find().select(['-password', '-__v', '-_id']);
        return res.status(200).json({ status: 200, message: "successfully listed", data: listdata })
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message || error });
    }
}

module.exports = {
    registration, logedin, getUserlist
}