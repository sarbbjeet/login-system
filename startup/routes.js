const userRoute = require('../route/users')
const loginRoute = require('../route/login') //check email and password
const reset_password = require('../route/resetPassword') //secret code verification route
const myaccount = require('../route/MyAccount')



module.exports = (app) => {

    app.use('/api/users', userRoute)
    app.use('/api/login', loginRoute)
    app.use('/api/reset-password', reset_password)
    app.use('/api/myaccount', myaccount) //access user account after authentication 
}