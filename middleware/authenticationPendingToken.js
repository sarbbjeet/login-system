const config = require('config')
const jwt = require('jsonwebtoken')
const authenticationPendingToken = (req, res, next) => {

    const token = req.header('x-auth-token') //access token from header
    if (!token) return res.status(401).json({ success: false, message: "Access denied: token is required" })
    jwt.verify(token, config.get('jwtKey'), (err, user) => {
        if (err)
            return res.status(401).json({ success: false, message: 'Access denied: verification error (token is required)' })
        else
            req.user = user; //pass all user parameters to req.user object  

    });
    next() //pass pipeline  

}
module.exports = authenticationPendingToken