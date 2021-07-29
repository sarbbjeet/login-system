const nodemailer = require('nodemailer')
const config = require('config')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.get('mailUsername'),
        pass: config.get('mailPassword')
    }
})


const mailSender = async(subject, body, receiver) => {
    return await transporter.sendMail({
        from: config.get('mailUsername'), //env variable saved email address
        to: receiver,
        subject: subject,
        text: body,
        //html: '<h1>help me </h1>'
    })
}

module.exports = mailSender