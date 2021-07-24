const express = require('express')
const { User, userSchema, userValidate } = require('../model/user')
const _ = require('lodash') //pick selected item 
const bcrypt = require('bcrypt')
const route = express.Router()


//create new user 
route.post('/', async(req, res) => {
    const { error } = userValidate(req.body)
    if (error) return res.status(400).send({ success: false, message: error.details[0].message })

    let user = await User.findOne({ email: req.body.email })
    if (user) res.status(400).send({ success: false, message: 'email id is already register' })
        //password hashing  
    const salt = await bcrypt.genSalt(10)
    const pass = await bcrypt.hash(req.body.password, salt)
    user = await new User(_.pick(req.body, ['firstname', 'lastname', 'email', 'role', 'createdDate']))
    user.password = pass //hasing password
    await user.save() //save user data to database

    const token = await user.generateJwtToken()
    return res.header('x-auth-token', token).send({
        success: true,
        message: _.pick(user, ['_id', 'role', 'status'])
    })

})

module.exports = route