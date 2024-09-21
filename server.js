// server.js
const myExpress = require("express");
const app = myExpress();
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();
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


module.exports = app; // Export the app for Vercel
