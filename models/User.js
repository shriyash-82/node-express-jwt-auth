const mongoose = require("mongoose");
const {isEmail} = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    email : {
        type : String,
        unique : true,
        required : [true, "please enter your email"],
        lowercase : true,
        validate : [isEmail,"please enter a valid email"]
    },
    password : {
        type : String,
        minlength : [6, "minimum length of password should be 6"],
        required : [true, "please enter the password"]
    }
})
//   // fire a function after doc has been saved to db
//   userSchema.post('save', function(doc,next) {
//     console.log("new user has been created and saved to db",doc);
//     next();
//   })

//   // fire a function before doc is saved to db

//   userSchema.pre("save", function (next) {
//     console.log("user is about to be created",this);
//     next();
//   })

// now hashing password before saving doc in db using middleware or mongoose hooks
userSchema.pre( "save",function (next) {
        const hash =  bcrypt.hashSync(this.password,10)
        this.password = hash;
   next();
})

// creating static login method inside schema
userSchema.statics.login = async function (email,password) {
    const user = await this.findOne({email})
    if(user) {
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user
        }
        throw Error("incorrect password")
    }
    throw Error('incorrect email')
}

const User = mongoose.model("user",userSchema);
module.exports = User;