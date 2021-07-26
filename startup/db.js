const mongoose = require('mongoose')
const winston = require('winston')
const config = require('config')
let db_url = ""
const db = () => {

    if (process.env.NODE_ENV == 'produnction')
        db_url = config.get('remote_db_url')
    else {
        console.log("production mode and db_url", db_url);
        // console.log(process.env.NODE_ENV)
        db_url = config.get('local_db_url')
    }

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