const express = require('express')
const route = express.Router()
const app = express()
const winston = require('winston')
const http = require('http')
const server = http.createServer(app)
require('express-async-errors') //no need to write try/catch block 
const userRoute = require('./route/users')
const loginRoute = require('./route/login') //check email and password
const errors = require('./startup/errors')
require('./startup/db')() //mongodb connection
let host = '0.0.0.0'
let port = 3000 // default port  

route.get('/', async(req, res) => {
    res.send("hello world")
})

app.use(express.json())
app.use('/', route)
app.use('/api/users', userRoute)
app.use('/api/login', loginRoute)
app.use(errors) //handle all errors from a single module no need to try/catch block 
if (process.env.NODE_ENV == 'production')
    port = process.env.PORT
else port = 3000 // local 3000 port 


server.listen(port, host, () => winston.info(`server listening on ${port} port`))