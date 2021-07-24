const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const route = express.Router()
const _ = require('lodash') //selected keywords
const { User, userSchema, userValidate } = require('../model/user')


//validate email and password 
const loginValidate = (login) => {
        const schema = {
            email: Joi.string().required().email(),
            password: Joi.string().required().min(6)
        }
        return Joi.validate(login, schema)
    }
    //login post 
route.post('/', async(req, res) => {

    const { error } = loginValidate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("email id is not register")
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("password is invalid")
        //generate token  
    const token = await user.generateJwtToken()
    return res.header('x-auth-token', token).send({
        success: true,
        message: _.pick(user, ['_id', 'role', 'status'])
    })
})
module.exports = route