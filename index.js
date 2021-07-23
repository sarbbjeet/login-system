const express = require('express')
const route = express.Router()
const app = express()
const winston = require('winston')
const http = require('http')
const server = http.createServer(app)
let host = '0.0.0.0'
let port = 3000 // default port  




route.get('/', async(req, res) => {
    res.send("hello world")
})

if (process.env.NODE_ENV == 'production')
    port = process.env.PORT
else port = 3000 // local 3000 port 


server.listen(port, host, () => winston.info(`server listening on ${port} port`))