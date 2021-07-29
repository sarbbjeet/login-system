const express = require('express')
const route = express.Router()
const app = express()
app.use(express.json())
const winston = require('winston')
const http = require('http')
const server = http.createServer(app)
require('express-async-errors') //no need to write try/catch block 
const errors = require('./startup/errors')
require('./startup/db')() //mongodb connection
require('./startup/routes')(app)
let host = '0.0.0.0'
let port = 3000 // default port  

route.get('/', async(req, res) => {
    //console.log(req.connection.remoteAddress)
    let forwarded = req.headers['x-forwarded-for']
    let ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
    res.json({ success: true, message: "Welcome to login system api server", ip })
})

app.use('/', route)
app.use(errors) //handle all errors from a single module no need to try/catch block 
if (process.env.NODE_ENV == 'production')
    port = process.env.PORT
else port = 3000 // local 3000 port 


server.listen(port, host, () => winston.info(`server listening on ${port} port`))