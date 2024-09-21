const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: String,
    title: String,
    sn: String,
    category: String,
    image: String,
    subCategory: String,
    price: String,
    total:Number,
    quantity: String,
    discount: Number,
    size:String,
    color:String,
    fabric:String,
    detail:String,
    base:String,
    headboard:String,
    ottoman:String,
    mattress:String,

});

const orderSchema = new mongoose.Schema({
    userId: String,
    orderId: String,
    orderItems: [orderItemSchema],
    total:Number,
    name1: String,
    name2: String,
    number1: {
        type:Number,
        trim:true
    },
    street:String,
    appartment:String,
    country:String,
    city:String,
    postal:String,
    email: String,
    payment:String,
    shipping:Number,
    note:String,
    date: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
