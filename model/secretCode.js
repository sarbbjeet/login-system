const mongoose = require('mongoose')
const Joi = require('joi')
const codeSchema = new mongoose.Schema({
    code: { type: String, required: true },
    email: { type: String, required: true },
    dateCreated: { //secret code will expires after 10min
        type: Date,
        default: Date.now(),
        expires: 600,
    },
})

const Code = mongoose.model('secret_code', codeSchema)

const codeValidate = (code) => {
    const schema = {
        code: Joi.string().required(),
        email: Joi.string().email().required(),
        dateCreated: Joi.date()
    }

    return Joi.validate(code, schema)
}

module.exports = { codeSchema, Code, codeValidate }