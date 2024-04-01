const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username : {type: String, unique : true , required : true},
    email : { type: String, unique: true , required : true},
    password : {type : String, required : false},
    googleId : {type : String, required : false},
    profileImageUrl: { type: String, required: false },
    stars : { type : Number , required : false , default : 0},
    usersPosts : [{ type : mongoose.Schema.Types.ObjectId , ref: 'Post'}],
    usersSavedPosts : [{ type : mongoose.Schema.Types.ObjectId , ref: 'Post'}],

});

module.exports = mongoose.model("User", userSchema)









