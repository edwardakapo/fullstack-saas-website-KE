const mongoose = require("mongoose")




const likeSchema = new mongoose.Schema({
    userId: { type: mongoose.ObjectId, required: true },
    likeType: { type: String, required: true }
}, { _id: false }); // _id: false to prevent creation of an id for subdocuments

const commentSchema = new mongoose.Schema({
    //postId: {type: mongoose.ObjectId, required : true},
    userId: { type : mongoose.ObjectId, required : true},
    username: {type : String, required : true},
    text : {type : String, required : true},
    postedAt: {type : Date, default : Date.now}
});

const postSchema = new mongoose.Schema( {
    author : {type : String , required : true},
    authorId : {type : mongoose.ObjectId, required : true},
	title : { type : String, required : true},
	body :  { type : String, required : true},
    numberOfComments : {type : Number, required : false, default : 0},
    numberOfLikes : {type : Number, required : false, default : 0},
    numberOfDislikes : {type : Number, required : false, default : 0},
    postedAt : {type:Date, default : Date.now},
    likes: [likeSchema],
    comments: [commentSchema],
    correctSolution : {type : Boolean, required : false, default: null}, // marks that post has correct solution 
    correctPost: {type : commentSchema, required : false, default: null} // correct post
});

postSchema.index({title : "text" , body : "text"})
// Add a method to the postSchema to update the counts
postSchema.methods.updateCounts = function() {
    this.numberOfComments = this.comments.length;

    // Assuming 'likeType' can be 'like' or 'dislike'
    this.numberOfLikes = this.likes.filter(like => like.likeType === 'like').length;
    this.numberOfDislikes = this.likes.filter(like => like.likeType === 'dislike').length;

    return this.save(); // Save the updated post document
};

// Rest of your postSchema code
module.exports = mongoose.model("Post" , postSchema)












