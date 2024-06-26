const express = require("express")
const router = express.Router()
const Post = require("../models/post")
const auth = require("../middleware/auth")
const User = require("../models/user")

//get all posts in 
router.get("/post", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const posts = await Post.find()
			.sort({postedAt : -1})
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//anyone can get post information do not need to be logged in
router.get("/post/:id" , async (req, res) => {

	const postId = req.params.id
	try {
		const post = await Post.findById(postId);
		if(!post){
			return res.status(404).json("Post not found");
		}
		return res.status(200).json(post);
	}
	catch (err){
			return res.status(400).json({message : "error finding post"})
		}

});

//search for posts if post text matches else return first x posts in descending order
router.get("/post/search", async (req, res) => {
    const searchTerm = req.query.term;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!searchTerm) {
        return res.status(400).json({ message: "Search term is required" });
    }

    try {
        let posts = await Post.find({
            $text: { $search: searchTerm }
        })
        .sort({ postedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

        if (posts.length === 0) {
			res.status(404).json("No posts with that search term found")
        }

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// calculate the likes and dislikes on a post
router.get("/post/:id/likes", async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const likes = post.likes;
        let upvotes = 0;
        let downvotes = 0;

        for (let like of likes) {
            if (like.likeType === 'upvote') {
                upvotes++;
            } else if (like.likeType === 'downvote') {
                downvotes++;
            }
        }

        res.status(200).json({ likes : upvotes, dislikes : downvotes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Return a list of all the comments on a post
router.get("/post/:id/comments", async (req, res) => {
    const postId = req.params.id;
    var comments = []
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Assuming 'comments' is a field in your Post model
        comments = post.comments;
        const isCorrectSolution = post.correctSolution;
        const correctPost = post.correctPost;


        res.status(200).json({comments, correctPost, isCorrectSolution});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//only verified users can create posts
router.post("/post" , auth , async (req, res) => {
    const user = req.user.username //OP
    const authorId = req.user._id
    const { title, text } = req.body // content
    console.log("Trying to create new post")
    console.log("title" , title);
    console.log("text" , text);

    //no inputs
    if(!title || !text){
        console.log("No inputs received")
        return res.status(400).json("No information for post")
    }

    try {
        //create post
        const post = await Post.create({
            author : user,
            authorId : authorId,
            title : title,
            body : text,
        })        
        console.log("POST CREATED")
        const OP = await User.findById(authorId);
        OP.usersPosts.push(post._id);
        await OP.save();
        console.log("saved post id to user")
        res.status(200).json({post})
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})



// adds a post object the links it to the parent post and root post of that parent post
// creats a tree heirarchy of posts
router.patch("/post/:id/comment", auth, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;
	const username = req.user.username
    const { text } = req.body;
    console.log("trying to make a comment")
    console.log(postId,username,userId)

    if (!text) {
        return res.status(400).json({ message: " text required for comment" });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Add a new comment to the post
        post.comments.push({  text, username, userId });
        console.log('Comment created')
        console.log(post.comments)
        post.numberOfComments += 1;
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/post/:id/save", auth, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;
    console.log("user is trying to save post");

    try {
        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the post is already saved to prevent duplicates
        if (!user.usersSavedPosts.includes(postId)) {
            user.usersSavedPosts.push(postId);
            await user.save(); // Save the updated user document
            res.status(200).json({ message: "Post saved successfully" });
        } else {
            res.status(400).json({ message: "Post already saved" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while saving the post" });
    }
});

router.patch("/post/:id/unsave", auth, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;
    console.log("user is trying to unsave post");

    try {
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the post is actually saved
        if (user.usersSavedPosts.includes(postId)) {
            // Remove the post from the usersSavedPosts array
            await User.updateOne({ _id: userId }, { $pull: { usersSavedPosts: postId } });
            res.status(200).json({ message: "Post unsaved successfully" });
        } else {
            res.status(400).json({ message: "Post not found in saved posts" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while unsaving the post" });
    }
});

//upvote change like type to upvote if it already exists as upvote
router.patch("/post/:id/upvote", auth, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find the like by this user
        const like = post.likes.find(like => like.userId.equals(userId));

        if (like) {
            // If upvoted do nothing, if downvoted update numbers
            if(like.likeType == 'upvote'){
				return res.status(400).json("You have already upvoted this post")
			}else{
				like.likeType = 'upvote';
				post.numberOfLikes = post.numberOfLikes + 1
				post.numberOfDislikes = post.numberOfDislikes - 1
			};
        } else {
            // If the user hasn't liked the post yet, add a like
            post.likes.push({ userId: userId, likeType: 'upvote' });
			post.numberOfLikes = post.numberOfLikes + 1
        }
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//downvote change like type to downvote if it already exists as upvote
router.patch("/post/:id/downvote", auth, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Find the like by this user
        const like = post.likes.find(like => like.userId.equals(userId));

        if (like) {
            // if type is upvote change to downvote and adjust numbers
			    if(like.likeType == 'upvote'){
				like.likeType = 'downvote';
				post.numberOfLikes = post.numberOfLikes - 1
				post.numberOfDislikes = post.numberOfDislikes + 1
			} else {
				// If the user has already disliked the post, do nothing
				return res.status(400).json("You have already disliked this post")
			};

        } else {
            // If the user hasn't liked the post yet, add a like
            post.likes.push({ userId: userId, likeType: 'downvote' });
			post.numberOfDislikes += 1
        }
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/post/:id/comments/:commentId/setcorrect", auth, async(req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;
    const commentId = req.params.commentId;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!post.authorId.equals(userId)) {
            return res.status(403).json({ message: "User does not have permission to set correct post" });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Fetch the user involved only once
        const userToAdjust = await User.findById(comment.userId);

        // Check if the same comment is being toggled
        if (post.correctPost && post.correctPost._id.equals(commentId)) {
            // Unset if the same comment is clicked again
            userToAdjust.stars -= 1; // Decrement stars since un-starring
            post.correctPost = null;
            post.correctSolution = false;
        } else {
            // Check if the previous correct comment belongs to the same user
            const isSameUser = post.correctPost && post.correctPost.userId.equals(comment.userId);

            // Set new correct comment
            if (post.correctPost) {
                // If there was another correct comment and it's not the same user, decrement stars from that user
                if (!isSameUser) {
                    const previousUser = await User.findById(post.correctPost.userId);
                    previousUser.stars -= 1;
                    await previousUser.save();
                }
            }
            // Only increment stars if the previous correct comment was not from the same user
            if (!isSameUser) {
                userToAdjust.stars += 1; // Increment stars for new correct comment user
            }
            post.correctPost = comment;
            post.correctSolution = true;
        }

        // Save changes
        await userToAdjust.save();
        await post.save();

        res.status(200).json({ correctComment: comment, correctSolution: post.correctSolution });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while updating the correct comment" });
    }
});

router.delete("/post/:id/delete", auth, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Only the user who created the post should be able to delete it
        if (!post.authorId.equals(userId)) {
            return res.status(403).json({ message: "User does not have permission to delete this post" });
        }
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router