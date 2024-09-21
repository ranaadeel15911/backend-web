let mongoose = require("mongoose");

let productSchema = mongoose.Schema({
    images: [String],
    title: String,
    description: String,
    color1:String,
    color2:String,
    color3:String,
    color4:String,
    color5:String,
    size1:String,
    size2:String,
    size3:String,
    size4:String,
    size5:String,
    size6:String,
    status:String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        type:String,
        ref: 'Collection', // Reference to Collection schema
    },
    sn: {
        type: Number,
        trim: true,
        unique: true,
    },
    discount: {
        type: Number,
        trim: true,
    },
    price: {
        type: Number,
        trim: true,
    },
    Fprice: {
        type: Number,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

let Product = mongoose.model('product', productSchema);

module.exports = Product;
