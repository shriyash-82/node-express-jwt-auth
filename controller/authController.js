const User = require("../models/User")
const jwt = require('jsonwebtoken')
// error handling

const errorHandler = (err) => {
    console.log(err.message,err.code);
    let errors = {email : "", password : ""}
      
      // email error while logging
      if(err.message === "incorrect email")
      {
        errors.email = "this email is not registered"
      }
      // handling password error while logging
      if(err.message === "incorrect password") {
        errors.password = "incorrect password"
      }
     // duplicate error code, like if u r tyring to enter duplicate email
    if(err.code === 11000) {
        errors.email = "this email is already in use"
        return errors;
    }

    // validating error
    if(err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach( ({properties}) => {
            // updating our above error object with error's
            errors[properties.path] = properties.message
        })
    }
    return errors;
}

// creating jwt token
const maxAge  = 3*24*60*60; // token is going to be expired in 3 days
const createToken = (id) => {
    return jwt.sign({id}," shriyash awasthi", {
        expiresIn : maxAge
    })
}
module.exports.signup_get = (req,res) => {
    res.render("signup");
}

module.exports.login_get = (req,res) => {
    res.render("login");
}

module.exports.signup_post = async (req,res) => {
    const {email,password} = req.body;
    try{
     const user = await User.create({email,password});
     // in signup api u have to generate token after saving user cred. in databse
     const token = createToken(user._id);
     //  now saving this token in cookie 
     res.cookie('jwt',token, {httpOnly : true, maxAge : maxAge*1000})
      return res.status(201).json({user : user._id})
    }
    catch(err) {
      const error = errorHandler(err);
      res.status(400).json({ error })
    }
    res.send("new user created")
}

module.exports.login_post = async (req,res) => {
    const {email,password} = req.body;
    console.log(req.body)
    try{
      const user = await User.login(email,password)
      const token  = createToken(user._id);
      res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
      return res.status(200).json({user : user._id})
    }
    catch(err){
        const errors = errorHandler(err)
        res.status(400).json({errors})
    }
}

module.exports.logout_get = (req,res) => {
    // for logging out we have to remove the cookie but we can not do that so, we are trying to set cookie as empty string
    res.cookie('jwt',"",{maxAge : 1})
    res.redirect('/')
}