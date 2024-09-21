    let mongoose = require("mongoose");

    let blogSchema = mongoose.Schema({
        title:String,
        author:String,
        issueDate:Date,
        introduction:String,
        heading1:String,
        description1:String,
        heading2:String,
        description2:String,
        heading3:String,
        description3:String,
        heading4:String,
        description4:String,
        heading5:String,
        description5:String,
        heading6:String,
        description6:String,
        image:String,
        date: {
            type: Date,
            default: Date.now,
        },
    });

    let Blog = mongoose.model('blog', blogSchema);

    module.exports = Blog;
