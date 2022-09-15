const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const schema = mongoose.Schema

const userSchema = new schema({
    name:
    {
        type: String
    },
    email:
    {
        type: String,
        unique: true
    },
    phone:
    {
        type: String,
        unique: true
    },
    password:
    {
        type: String
    },
    admin: {
        type: Boolean,
        default: false
    }
}, { timestamp: true })

userSchema.methods.generateToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN)
    return token;
}


const userdatas = mongoose.model('userdatas', userSchema)

module.exports = userdatas;