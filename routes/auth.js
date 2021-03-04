const express = require('express')
const session = require("express-session");
const flash = require("express-flash-messages");
const passport = require("passport");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const parameters = require("../config/params");
const AuthController = require('../controller/AuthController')
const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;
const User = require('../models/User')


const router = express.Router()

router.use(flash());

// middlewares

router.use(passport.initialize());
router.use(passport.session());
router.use(cookieParser());

router.use(session({
    name: parameters.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    secret: parameters.SESSION_SECRET,
    cookie: {
        maxAge: SEVEN_DAYS,
        sameSite: true,
        //secure: parameters.NODE_ENV === "production",
        secure: process.env.NODE_ENV == "production" ? true : false
    }
}));
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});



// ensuring when users logout they can't go back with back button
router.use(function (req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});
// routes

router.use(function(req, res, next) {
    res.locals.role = req.session.role;
    next();
  });


//GET signup page
router.get('/signup', (req,res)=>{
    let reference = req.query.ref
    if (reference != null) {
        req.session.ref = reference;
    } else {
        req.session.ref = "";
    }
    res.render("auths/register3");

})

router.post("/register", async (req, res) => {
    try {
      const data = req.body;
      console.log(req.body)
      if (
        !data.name ||
        !data.email ||
        !data.phone ||
        !data.password
      ) {
        
        //handle clientside error here but console log for now
        console.log("Please fill all fields");
        return res.send({ msg: "Please fill all fields" });
      }
  
      if (data.password.length < 6) {
        return res.send({ msg: "Password must be at least 6 characters" });
      } else {
        const user = await User.findOne({ email: data.email });
        if (user) {
          console.log("User exists, choose another email");
          res.redirect("/signup");
        } else {
          const newUser = await new User({
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
          });
  
        //   const walletDetails = {
        //     owner: newUser._id,
        //     amount_deposited: 0,
        //     revenue: 0,
        //     widthdrawal: 0,
        //   };
          //const userWallet = await walletServices.addUserWallet(walletDetails);
         // newUser.wallet = userWallet;
          await newUser.save();
          console.log("User created");
          newUser;
          res.redirect("/");
          console.log("dashboard redirect successful");
        }
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  });


router.post("/signup", AuthController.register);
router.post('/login',AuthController.login )



module.exports = router