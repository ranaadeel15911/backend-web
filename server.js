const myExpress = require("express");
const app = myExpress();
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();
app.use(myExpress.json());
app.use(cors());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,  // Make sure to add this in Vercel env variables
    pass: process.env.EMAIL_PASS,  // Make sure to add this in Vercel env variables
  },
});

// Helper function to generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Set up server port
const port = process.env.PORT;

// Start listening on port
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});

// Import database models
require("./model/db");
const SignupUsers = require("./model/user");
const token = require("jsonwebtoken");

// User signup route
app.post("/signUp", async (req, res) => {
  try {
    const existingUser = await SignupUsers.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).send("User with this email already exists");
    } else {
      const otp = generateOTP();
      const otpExpires = Date.now() + 10 * 60 * 1000;  // OTP expires in 10 minutes

      const newUser = new SignupUsers({
        ...req.body,
        password: req.body.password,
        points: 100,
        role: "user",
        level: "1",
        otp: otp,
        otpExpires: otpExpires,
        isVerified: false,
      });

      const savedUser = await newUser.save();
      const userId = savedUser._id;

      // Send verification email
      const mailOptions = {
        from: "'SHOP.CO' <ra0511083@gmail.com>",
        to: req.body.email,
        subject: "Verify Your Email",
        text: `Your OTP for email verification is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.log("Error while sending email:", error);
        } else {
          console.log("Email sent successfully");
        }
      });

      return res.status(200).json({
        message: "User Created. Please verify your email using the OTP sent.",
        email: req.body.email,
        userId: userId,
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal Server Error");
  }
});

// Email verification route
app.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await SignupUsers.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.isVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      res.status(200).json({ message: "Email verified successfully" });
    } else {
      res.status(400).send("Invalid or expired OTP");
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

// Forgot Password route
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await SignupUsers.findOne({ email });
    if (!user) {
      return res.status(404).send("No user with that email");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000;  // Token valid for 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    const mailOptions = {
      to: user.email,
      from: "'SHOP.CO' <ra0511083@gmail.com>",
      subject: "Password Reset",
      text: `Please click the following link to reset your password: \n\n http://localhost:3000/reset-password/${token} \n\n This link is valid for one hour.`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log("Error sending email:", err);
        return res.status(500).send("Error sending email");
      }
      res.status(200).send("Password reset email sent.");
    });
  } catch (err) {
    console.error("Error in forgot-password:", err);
    res.status(500).send("Server error");
  }
});

// Reset Password route
app.post("/reset-password/:token", async (req, res) => {
  const { password } = req.body;

  try {
    const user = await SignupUsers.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Password reset token is invalid or has expired.");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    const mailOptions = {
      to: user.email,
      from: "'SHOP.CO' <ra0511083@gmail.com>",
      subject: "Password Change Confirmation",
      text: "This is a confirmation that your password has been successfully changed.",
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).send("Error sending confirmation email");
      }
      res.status(200).send("Password has been reset successfully.");
    });
  } catch (err) {
    console.error("Error in reset password:", err);
    res.status(500).send("Server error");
  }
});

// Export the app for Vercel deployment
module.exports = app;
