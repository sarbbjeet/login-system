//module to handle error from a center point 
module.exports = (err, req, res, next) => {
    return res.status(500).send({ success: false, message: err.message })
}