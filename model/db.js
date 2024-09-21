let mongoose = require('mongoose');

try {
    let connect = mongoose.connect(process.env.MONGODB_URI);
    console.log("db connected")
} catch (e) {
    console.log(e)
}