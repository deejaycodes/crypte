const userServices = require("../services/userServices");
const encryptionManager = require("../libs/encryption");
const axios = require("axios");
const setAuthToken = require("../controllers/setAuthToken");
const User = require("../models/User");
const Wallet = require("../models/Wallet");

const walletServices = require("../services/walletServices");

class Auth {
  async signUp(req, res) {
    let data = req.body;
    if (data.password !== data.password2) {
      return res.status(400).send("passwords do not match");
    }
    try {
      const userExist = await userServices.getUser({ email: data.email });
      if (userExist) {
        return res.status(400).send("Email is already registered");
      }

      const param = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        country: data.country,
        walletAddress: data.walletAddress,
        password: data.password,
        password2: data.password2,
      };

      //add new user object
      const user = await userServices.addUser(param);
      const token = await user.generateAuthToken();

      const walletDetails = {
        owner: user._id,
        amount_deposited: 0,
        revenue: 0,
        widthdrawal: 0,
      };
      const userWallet = await walletServices.addUserWallet(walletDetails);
      user.wallet = userWallet;
      await user.save();
      user;

      req.flash("success_msg", "You are now registered and can log in");
      res.redirect("/login");
      //res.status(201).json({ user, token, userWallet });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async logIn(req, res) {
    const { email, password } = req.body;
    //check if email and password is filled
    if (!email || !password) {
      return res.status(400).send("Email and Password is required");
    }

    //check if user exists in the database
    try {
      const user = await userServices.getUser({ email });
      if (user) {
        //check if password is correct
        if (encryptionManager.compareHashed(password, user.password)) {
          //generate a token for the user to login
          const token = await user.generateAuthToken();

          await user.save();
          user;
          res.send({ user: user, myToken: token });
          res.render("pages/dashboard", { user, mytoken: "token" });

          // res.status(200).json({
          //   message: "user logged in succesfully",
          //   user,
          //   token,
          // });
        } else {
          res.redirect("/login", {
            msg: "You are not authenticated",
          });
        }
      } else {
        return res.status(400).send("User does not exist");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getUser(req, res) {
    try {
      const id = req.params.id;
      const user = await User.findOne({ _id: id });
      res.status(200).json({
        message: "User fetched successfully",
        user,
      });
    } catch (error) {
      res.status(400).json({
        msg: error,
      });
    }
  }

  // async testLogin(req, res) {
  //   try {
  //     const data = req.body;
  //     console.log(data);
  //     const res = await axios({
  //       method: "POST",
  //       url: "http://localhost:5000/auth/login",
  //       data,
  //     });
  //     // if (localStorage.token) {
  //     //   setAuthToken(localStorage.token);
  //     // }
  //     //console.log(req.body);
  //     console.log(res.data.data);
  //     // Set token to local Storage
  //     //localStorage.setItem("user_token", token);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}

const auth = new Auth();
module.exports = auth;
