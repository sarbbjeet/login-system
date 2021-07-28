const mongoose = require('mongoose')
const winston = require('winston')
const config = require('config')
const username = config.get('user') //username of remote mongodb 
const password = config.get('pass') // password of remote mongodb
const dbName = config.get('dbName')

const remote_url = `mongodb+srv://${username}:${password}@cluster0.suij1.mongodb.net/${dbName}?retryWrites=true&w=majority`
let db_url = ""
const db = () => {

    if (process.env.NODE_ENV == 'production') //code deploy on heroku server
        db_url = remote_url //connect with cloud mongodb server 
    else
        db_url = config.get('local_db_url') + dbName //connect with local mongodb server

    mongoose.connect(db_url, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        .then((value) => winston.info(`connected to mongodb`))
        .catch(err => winston.error(err))

}
module.exports = db