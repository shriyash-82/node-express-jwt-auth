const jwt = require("jsonwebtoken")
const User = require('../models/User')
const requireAuth = (req,res,next) => {
    // extracting token from cookie
    const token = req.cookies.jwt;

    // checking token exist or verified
    if(token){
      jwt.verify(token, ' shriyash awasthi',(err,decodedToken) => {
        if(err){
            console.log(err.message)
            res.redirect('/login')
        }
        else {
            console.log(decodedToken);
            next();
        }
      })
    }
    else {
        res.redirect('/login')
    }
}

// checking current user
const checkUser =  (req,res,next) => {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, " shriyash awasthi", async (err,decodedToken)=>{
            if(err){
                console.log(err.message)
                res.locals.user = null
                next();
            }
            else {
                console.log(decodedToken)
                // our token has payload as _id, so our decodedToekn too have it
                // so now first we will find that document from db
                let user = await User.findById(decodedToken.id);
                // now trying to show the valid user in the views
                res.locals.user = user
                next();
            }
        })
    }
    else {
        res.locals.user = null
        next()
    }
}
module.exports = {requireAuth,checkUser}