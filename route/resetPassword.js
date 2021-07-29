const express = require('express')
const { Code } = require('../model/secretCode')
const { User } = require('../model/user')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const cryptoRandomString = require('crypto-random-string')
const mailSender = require('../additional_module/mailSender')
const route = express.Router()

//generate secret code  to reset password with the help of email address
//send email as post request {email: "xy@email.com"}
route.post('/get-code', async(req, res) => {
    const user = await User.findOne({ email: req.body.email })
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
    let subject = "otp"
    let body = `reset password code=${secretCode} Please use this code within 10 min otherwise it will expires \n
    just go to POST /reset-password route and post {email, password, confirmPassword, secretCode} json data`
    await mailSender(subject, body, user.email) //send mail with verification code otp 
    return res.json({ succes: true, message: 'verification code sent to register email address' })
})


/*
change password route
#route  POST /reset-password
#post-json {email:abc ,password: .., confirmPassword: ..., secretCode:abc123}
*/

route.post('/', async(req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send({ success: false, message: 'email id is not register' })
        //check secretCode
    let code = await Code.findOne({ email: user.email, code: req.body.secretCode })
    if (!code) return res.status(400).json({ success: false, message: 'invalid secretCode' })
    if (!(req.body.password === req.body.confirmPassword))
        return res.status(400).json({ success: false, message: 'password mismatch' })
    const genSalt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(req.body.password, genSalt) //password hashing
    user.status = true //no need to activate email again
    user = await user.save()

    await Code.deleteMany({ email: user.email }) //delete all secret code
    return res.json({
        success: true,
        message: 'successfully changed password'
    })


})

module.exports = route