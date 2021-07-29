const express = require('express')
const { User, userValidate } = require('../model/user')
const { Code, codeValidate } = require('../model/secretCode')
const _ = require('lodash') //pick selected item 
const bcrypt = require('bcrypt')
const route = express.Router()
const cryptoRandomString = require('crypto-random-string')
const mailSender = require('../additional_module/mailSender')
const authenticationPendingToken = require('../middleware/authenticationPendingToken')
const authenticationToken = require('../middleware/authenticationToken')


//create new user
//public  
route.post('/', async(req, res) => {
    const { error } = userValidate(req.body)
    if (error) return res.status(400).json({ success: false, message: error.details[0].message })

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).json({ success: false, message: 'email id is already register' })
        //password hashing  
    const salt = await bcrypt.genSalt(10)
    const pass = await bcrypt.hash(req.body.password, salt)
    user = await new User(_.pick(req.body, ['firstname', 'lastname', 'email', 'role', 'createdDate']))
    user.password = pass //hasing password
    await user.save() //save user data to database

    let secretCode = cryptoRandomString({ //generate 6 char random code 
            length: 6
        })
        //save generated code into database so we can use this code for further process 
    const validate = codeValidate({ code: secretCode, email: user.email })
    if (validate.error) return res.status(400).json({ success: false, message: validate.error.details[0].message })
    let code = new Code({
        code: secretCode,
        email: user.email
    })
    code = await code.save() //save secret code
        //send varification mail to register email address
    const baseUrl = `${req.protocol}://${req.get('host')}`
    let subject = "Your Activation Link ..."
    let body = `Please use the following link within the next 10 minutes to activate your account: ${baseUrl}/api/users/${user._id}/${secretCode}`
    await mailSender(subject, body, user.email) //send mail with verification code otp 

    const token = await user.generateJwtToken()
    return res.header('x-auth-token', token).json({
        success: true,
        message: _.pick(user, ['_id', 'role', 'status'])
    })
})

//get verification email 
//route GET /get-verfication-email 
//private
route.get('/get-verification-email', authenticationPendingToken, async(req, res) => {

    const user = await User.findById(req.user._id)
    if (!user) return res.status(400).send({ success: false, message: 'email id is not register' })
    const secretCode = cryptoRandomString({
        length: 6
    })
    let code = new Code({
        code: secretCode,
        email: user.email
    })
    code = await code.save() //save secret code
        //send varification mail to register email address
    const baseUrl = `${req.protocol}://${req.get('host')}`
    let subject = "Your Activation Link ..."
    let body = `Please use the following link within the next 10 minutes to activate your account: ${baseUrl}/api/users/${user._id}/${secretCode}`
    await mailSender(subject, body, user.email) //send mail with verification code otp 
    return res.json({ succes: true, message: 'verification code sent to register email address' })
})

// activate email by providing user id and secretCode sent to register email address
route.get('/:userId/:secretCode', async(req, res) => {

    let user = await User.findById(req.params.userId);
    if (!user)
        return res.status(400).send({ success: false, message: "wrong userId" })
    const response = await Code.findOne({
        email: user.email,
        code: req.params.secretCode,
    });
    if (!response) return res.status(400).send({ success: false, message: "wrong verification key" })

    user.status = true
    user = await user.save()
        //user = await User.updateOne({ email: user.email }, { status: true });
    await Code.deleteMany({ email: user.email }); //delete saved secret key from the database

    return res.json({ //add token to response header
        success: true,
        message: _.pick(user, ['_id', 'role', 'status'])
    })
})

//delete user account 
//private 
route.delete('/', authenticationToken, async(req, res) => {
    let user = await User.findByIdAndDelete(req.user._id)
    if (!user) res.status(401).json({ success: false, message: 'user id not found, may be wrong token' })
    return res.json({ success: true, message: 'succcessfully delete user account' })
})

module.exports = route