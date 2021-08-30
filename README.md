# Backend code for the login system that includes node js, express, jwt, bcrypt, and other features.
Backend built with Node.js/Express and MongoDB, with pre-defined authentication, email verification, and account deletion.
# ready to use
anyone can access this login-system api https://login-system12.herokuapp.com

# Features
- Mongodb (local and cloud)
- Email Verification 
- user details and password stored into environment variables
- Password reset and delete account
- Manage user Authentication using Json Web Token

# Login-System
A Node.js/Express server is put up on the backend. mongoDB is a database that stores user data and may be expanded. The following routes have been established:
- "/api/users"  POST request to create user account(Sign-up account) . Serves Json data from client side ex. ````{firstname: "abc", lastname: "anc", email: "a@mail.com, 
password: "2369banmbd"}````. Verification email with link sent to registered email address; click on the obtained verification link to activate user account.
- "/api/login"  POST route to login user account(Sign-in account) . Delivers json data from the client side, ex. ````{email:"a@mail.com", password: "2n3n2knk"}````.
Get a token linked to the header after successfully logging in. This token will be used to gain access to private routes.
- "/api/reset-password/get-code" POST route reset user account password using this method. Json data ex. ````{"email": "a@mail.com"}```` 
A message with a secret code will be sent to the supplied email address after the post request has been successfully submitted. That secret code will be 
used to reset the password for the user account.
- "api/reset-password" POST route send with json data ex. ````{email: "a@mail.com", password: "abh6772", confirmPassword: "abh6772", secretCode: "hj782"}````. 
- "/api/myacccount" GET route by passing valid JWT token user can access this route. 

# Set-Up
### Steps to set up development environment variables
1. install config ````npm i config```` 
2. create config folder with "default.json" and "custom-environment-variables.json" files
3. defined required enviroment variables in "default.json" and "custom-enviroment-variables files"
4. set custom environment variables on local machine server by typing ex: $ ````export variablename="variablevalue"````
5. set custom environment variables on remote server(heroku) by  typing ex: $ ````heroku config:set variablename="variablevalue"````
6. display saved custom variables on remote server by typing ex: $ ````heroku config````
7. display saved custom variables on local server by typing ex: $ ````export````
 
