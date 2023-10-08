const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require("./routes/authRoutes");
const app = express();
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://shriyashawasthi01feb:Password@0@cluster0.l98mxfp.mongodb.net/';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
// below line tells us that we r going to apply checkUser Middleware to all the get request
app.get('*', checkUser)
app.get('/',(req, res) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));
app.use(authRoutes)

//cookies

// app.get("/set-cookies", (req,res) => {
//   // res.setHeader('set-cookie', "newUser = true")
//   // new method for cookie's using cookie
//   res.cookie('newUser',false)
//   res.cookie("isEmployee",true,{maxAge : 1000*60*60*24,httpOnly :true})
//   res.send("cookie has been set")
// })

// app.get('/read-cookies',(req,res) => {
//     const cookies = req.cookies;
//     console.log(cookies);
//     res.json(cookies); 
// })

