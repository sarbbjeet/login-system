const express = require('express')
const isMailVerified = require('../middleware/authenticationToken')

const route = express.Router()

route.get('/', isMailVerified, async(req, res) => {
    return res.send("successfully login ....")

})

module.exports = route