const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/nodemailer");
const User = require("../models/User");

module.exports = {
  updatePassword: async (req, res, next) => {
    try {
      const { errors, isValid } = validateStudentUpdatePassword(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const {
        registrationNumber,
        oldPassword,
        newPassword,
        confirmNewPassword,
      } = req.body;
      if (newPassword !== confirmNewPassword) {
        errors.confirmNewpassword = "Password Mismatch";
        return res.status(400).json(errors);
      }
      const student = await Student.findOne({ registrationNumber });
      const isCorrect = await bcrypt.compare(oldPassword, student.password);
      if (!isCorrect) {
        errors.oldPassword = "Invalid old Password";
        return res.status(404).json(errors);
      }
      let hashedPassword;
      hashedPassword = await bcrypt.hash(newPassword, 10);
      student.password = hashedPassword;
      await student.save();
      res.status(200).json({ message: "Password Updated" });
    } catch (err) {
      console.log("Error in updating password", err.message);
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      const { errors, isValid } = validateForgotPassword(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        errors.email = "Email Not found, Provide registered email";
        return res.status(400).json(errors);
      }
      function generateOTP() {
        var digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < 6; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
      }
      const OTP = await generateOTP();
      user.otp = OTP;
      await user.save();
      await sendEmail(user.email, OTP, "OTP");
      res.status(200).json({ message: "check your registered email for OTP" });
      const helper = async () => {
        student.otp = "";
        await student.save();
      };
      setTimeout(function () {
        helper();
      }, 300000);
    } catch (err) {
      console.log("Error in sending email", err.message);
    }
  },

  postOTP: async (req, res, next) => {
    try {
      const { errors, isValid } = validateOTP(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const { email, otp, newPassword, confirmNewPassword } = req.body;
      if (newPassword !== confirmNewPassword) {
        errors.confirmNewPassword = "Password Mismatch";
        return res.status(400).json(errors);
      }
      const user = await User.findOne({ email });
      if (user.otp !== otp) {
        errors.otp = "Invalid OTP, check your email again";
        return res.status(400).json(errors);
      }
      let hashedPassword;
      hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return res.status(200).json({ message: "Password Changed" });
    } catch (err) {
      console.log("Error in submitting otp", err.message);
      return res.status(200);
    }
  },
};
