const config = require('config')
const jwt = require('jsonwebtoken')
const isMailVerified = (req, res, next) => {

    const token = req.header('x-auth-token') //access token from header
    if (!token) return res.status(401).json({ success: false, message: "Access denied: token is required" })
    jwt.verify(token, config.get('jwtKey'), (err, user) => {
        if (err || !user.status)
            return res.status(401).json({ success: false, message: 'verification error' })
        else
            req.user = user;

    });
    next() //pass pipeline  

}
module.exports = isMailVerified