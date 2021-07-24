// user schema to create a new user account 
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken')
const config = require('config') //get environment variables
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: "basic" },
    status: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now() }

})

//created a method to generate jwt token
userSchema.methods.generateJwtToken = async() => {
    let payload = { _id: this._id, role: this.role, status: this.status }
    let tokenKey = config.get('jwtKey')
    let token = await jwt.sign(payload, tokenKey)
    return token
}

const User = mongoose.model('users', userSchema)

//Joi client side validate 
const userValidate = (user) => {
    const schema = {
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        role: Joi.string(),
        status: Joi.boolean(),
        createdDate: Joi.date()
    }
    return Joi.validate(user, schema)
}

module.exports = { userSchema, User, userValidate }