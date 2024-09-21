// server.js
const myExpress = require("express");
const app = myExpress();
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();
app.use(cors());
app.use(myExpress.json());
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
   user: 'ra0511083@gmail.com',
    pass: 'qauk brdr ehmr twox'
  },
});
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};
const PORT = process.env.PORT || 3000;

// Define the root route
app.get('/', (req, res) => {
    res.send('Running Successfully in Production Mode');
});

// Start the server (this line will be ignored on Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
require("./model/db");
const bcrypt = require("bcrypt");
const SignupUsers = require("./model/user");
const Video = require("./model/video");
const Product = require("./model/product");
const Comment = require("./model/comments");
const Cart = require("./model/cart");
const Collection = require("./model/collections");
const Orders = require("./model/Order");
const Blog = require("./model/blog");
const token = require("jsonwebtoken");
const { appendFile } = require("fs/promises");
const { error } = require("console");
app.post("/signUp", async (req, res) => {
  console.log('Welcome');
  try {
    const existingUser = await SignupUsers.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("User with this email already exists");
    } else {
      const otp = generateOTP();
      const otpExpires = Date.now() + 10 * 60 * 1000;
      // const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new SignupUsers({
        ...req.body,
        // password: hashedPassword,
        password: req.body.password,
        points: 100,
        role: "user",
        level: "1",
        otp: otp,
        otpExpires: otpExpires,
        isVerified: false,
      });

      const savedUser = await newUser.save(); // Save the new user

      // After user is saved, the ID should be available
      const userId = savedUser._id;

      const mailOptions = {
        from: "'SHOP.CO' <ra0511083@gmail.com>",
        to: req.body.email,
        subject: "Verify Your Email",
        text: `Your OTP for email verification is: ${otp}`,
      };

      // Send email asynchronously without affecting the response
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error while sending email:", error);
        } else {
          console.log("Email sent successfully");
        }
      });

      // Respond with user ID immediately after saving user (email sending happens in the background)
      return res.status(200).json({
        message: "User Created. Please verify your email using the OTP sent.",
        email: req.body.email,
        userId: userId, // Return user ID here
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal Server Error");
  }
});



//verify email
app.post("/verify-email", async (req, res) => {
  console.log('first')
  try {
    const { email, otp } = req.body;
console.log(email,otp , "email")
    const user = await SignupUsers.findOne({ email });

    if (!user) {
      return res.status(404).json({message:"User not found"});
    }

    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.isVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      res.status(200).json({message:"Email verified successfully"});
    } else {
      res.status(400).send("Invalid or expired OTP");
    }
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

//forgot password
app.post("/forgot-password", async (req, res) => {
  console.log('first')
  const { email } = req.body;

  try {
    const user = await SignupUsers.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(404).send("No user with that email");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    const mailOptions = {
      to: user.email,
      from: "'SHOP.CO' <ra0511083@gmail.com>",
      subject: "Password Reset",
      text: `Please click the following link to reset your password: \n\n http://localhost:3000/reset-password/${token} \n\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log("err:", err);
        return res.status(500).send("Error sending email");
      }
      res.status(200).send("Password reset email sent.");
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = app; // Export the app for Vercel
