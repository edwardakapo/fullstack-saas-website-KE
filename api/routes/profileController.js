const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const User = require("../models/user")
const bycrypt = require('bcryptjs')


// get profile get all posts from user
router.get("/profile" , auth , async(req , res) => {
    console.log("tried to get posts from user profile")
    try {
		if (!req.user._id) {
			return res.status(400).json({message : "error no user id"});
		}
        const user = await User.findById(req.user._id)
            .populate('usersPosts')
            .populate('usersSavedPosts')

        res.status(200).json({
            usersPosts: user.usersPosts,
            usersSavedPosts: user.usersSavedPosts,
            usersStars: user.stars
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }

});

//update password
router.patch("/profile/password" , auth , async(req , res) => {

	const username = req.user.username

	const {oldPassword , newPassword} = req.body
	if(!username || !oldPassword || !newPassword){
		return res.status(401).json("error missing input")
	}
	// find the user then compare hashed password
	// if it's correct then we will allow the change
	// change password in database
	try{
		const user = await User.findOne({username})
		if ( user && await bycrypt.compare(oldPassword , user.password)) {
			console.log("user password is correct.....")
			user.password = await bycrypt.hash(newPassword, 10)
			await user.save()
			console.log("password has been changed")
			return res.status(200).json("password has been changed")
		}
		return res.status(400).json("password is incorrect")

	}
	catch(err){
		return res.status(500).send(err)
	}

})

//update email
router.patch("/profile/email" , auth , async(req , res) => {
    const username = req.user.username
    console.log('username' , username)
    const {password, newEmail} = req.body
    console.log('password', password)
    console.log('newEmail', newEmail)

    if(!username || !password || !newEmail){
        return res.status(400).json("error missing input")
    }
    try{
        const user = await User.findOne({username})
        if (user && await bycrypt.compare(password, user.password)) {
            if (await User.findOne({ email: newEmail })) {
                console.log("hey that email has already been used")
                console.log(newEmail)
                return res.status(404).json("email already exists")
            }
            console.log("user password is correct && Email is not already in use.....")
            user.email = newEmail
            await user.save()
            console.log("Email has been changed")
            return res.status(200).json("Email has been changed")
        }
        return res.status(401).json("password is incorrect")
    }
    catch(err){
        return res.status(500).send(err)
    }
})
//update profile picture
router.patch("/profile/picture" , auth , async(req , res) => {
    const username = req.user.username
    const { imageUrl } = req.body
    if(!imageUrl){
        return res.status(400).json("error missing input")
    }
    try{
        const user = await User.findOne({username})
        if (!user) {
            return res.status(404).json("User not found");
        }
        user.profileImageUrl = imageUrl
        await user.save()
        console.log("Image URL has been changed")
        return res.status(200).json("Image URL has been changed")
    }
    catch(err){
        return res.status(500).send(err)
    }
});

//delete user profile
router.delete("/profile", auth, async (req, res) => {
    const authUsername = req.user.username;
    const { username, password } = req.body;
    console.log({'username' : username, 'password' : password}) 
    if (!username || !password) {
        return res.status(401).json("error missing username or password");
    }
    if (authUsername != username){
        return res.status(403).json("that is not your username")
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json("User not found");
        }
        console.log('FOund user')
        console.log(user)
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json("Incorrect password");
        }
        console.log("passwords match")
        await user.deleteOne();
        console.log("User has been deleted");
        return res.status(200).json("User has been deleted");
    } catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
});


module.exports = router