const User = require("../models/User");
const mongoose = require("mongoose");
const setAuthToken = require("../controllers/setAuthToken");

class UsersController {
  //fetch a single user

  async getUserDashboard(req, res) {
    try {
      const id = req.user._id;
      if (req.user._id !== id) {
        return res.status(400).send("not allowed");
      }
      const user = await User.findById(id)
        .select("_id email fullName phoneNumber location joined lastUpdated")
        .exec();
      //res.send(user);
      //console.log(req.user._id);
      //res.status(200).send({ user });
      res.render("pages/dashboard", { user, myToken: token });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  //load a user's profile to dashboard
  async getUserProfile(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.findOne({ _id: userId });
      console.log(user);
      res.status(200).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async fetchUsers(req, res) {
    try {
      const users = await User.find({});
      res.status(200).json({
        message: "ALL users fetched",
        users,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async logOut(req, res) {
    //remove user token
    try {
      req.user.tokens = req.user.tokens.filter((element) => {
        return element.token !== req.token;
      });
      await req.user.save();
      res.status(200).send("logout succesful");
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async editUser(req, res) {
    try {
      const { fullName, phoneNumber, country } = req.body;
      const user = await User.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            fullName,
            phoneNumber,
            country,
          },
        },
        { useFindAndModify: false }
      );
      const updated = user.res.status(200).send({ user });
    } catch (error) {
      res.status(400).send(error);
    }
  }
  async updateProfile(req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["fullName", "phoneNumber", "country"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.include(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }
    try {
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      res.send(req.user);
    } catch (e) {
      res.status(400).send(e);
    }
  }
  //load user details from the database
  async loadUser(req, res) {
    try {
      const id = req.params.id;
      const userDetails = await User.findByOne({ _id: id });
      res.status(200).json({
        message: "User details fetched succesfully",
        userDetails,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

const usersController = new UsersController();
module.exports = usersController;
