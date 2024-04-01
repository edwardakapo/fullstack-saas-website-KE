const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const qs = require('qs')
require("dotenv").config()
const  { APP_TOKEN, DEFAULT_IMG_URL , MAX_AGE} = process.env
const {OAuth2Client} = require('google-auth-library')
const { getGoogleOAuthTokens } = require('../controller/functions')
const auth = require("../middleware/auth")



//login to an existing user, if not return error code to be handled by front-end
router.route('/login')
.get( (req, res, next) => {
    console.log('Login route')
    res.status(200).json('This is the login page from the login route')
})
.post( async (req,res) => {
    // login logic
    try {
        const {username , password} = req.body;
        console.log("entered username" , username)
        console.log("entered password" , password)

        //validate && sanitize inputs
        if(!username || !password) {
            return res.status(400).json("missing username or password")
        }

        //validate user existence from DB 
        const user = await User.findOne({ username : username })
        console.log("here")
        if(user){
            console.log("user found")
            console.log(user)

        }
        else {
            console.log("user does not exist send notification ")
            return res.status(400).json("invalid user or password")
        }


        //check hashed password
        if (await bcrypt.compare(password, user.password)){
            console.log("fully verified create token and save to cookie")
            // if true create and save jwt
            const payload  = { 
                _id : user._id.toString(),
                username : user.username 
            };
            const secret = APP_TOKEN;
            const token = jwt.sign (
                payload , secret , {expiresIn: '2h'}
            );

            const publicUserInfo = {
                picture : user.profileImageUrl,
                username : user.username,
            }
            res.cookie('token', token, { httpOnly: true });
            res.cookie('user', JSON.stringify(user), { httpOnly: true });
            res.cookie('userInfo' , JSON.stringify(publicUserInfo));
            res.cookie("isLoggedIn", "True", {maxAge: 3600000});
            res.status(200).json({Token : token , userObj : user})
        }
        else {
            console.log("password incorrect")
            res.status(400).json('invalid user or password')
        }
    }
    catch (err){
        console.log(err)
        return res.status(500).json("error with login")
    }

})

//register a new user if already exists send error code to be handled by front-end
router.route("/register")
.get( (req , res) => {
    console.log("register route")
    res.status(200).json("User Register page")
})
.post( async (req , res) => {
    //get user input
    try {
        const { username , email , password } = req.body
        if (!username || !email || !password){
            console.log(req.body)
            return res.status(400).json("incorrect form submission... all inputs are required")
        } 
        //sanitize inputs
        //check if user already exists
        const oldUser = await User.findOne({username : username})
        if(oldUser){
            console.log("hey that user already exists")
            console.log(oldUser)
            return res.status(401).json("user already exists")
        }

        //check if user email already exists
        const oldEmail = await User.findOne({ email : email })
        if (oldEmail) {
            console.log("hey that email has already been used")
            console.log(oldEmail)
            return res.status(401).json("email already exists")
        }
        //if not create user hash password
        console.log("creating new user...")
        let encryptedPassword = await bcrypt.hash(password, 10)
        console.log("password encrypted", encryptedPassword)

        const user = await User.create({
            username : username,
            email : email.toLowerCase(),
            password : encryptedPassword,
            profileImageUrl : DEFAULT_IMG_URL,
        })
        console.log("user created" , user)
        const payload  = { 
            _id : user._id.toString(),
            username : user.username,
            date: Date.now()
        };
        const secret = APP_TOKEN;
        const token = jwt.sign (
            payload , secret , {expiresIn: '2h'}
        );
        console.log('saving user to database')
        await user.save()
        const publicUserInfo = {
            picture : user.profileImageUrl,
            username : user.username,
        }
        res.cookie('token', token, { httpOnly: true });
        res.cookie('user', JSON.stringify(user), { httpOnly: true });
        res.cookie('userInfo' , JSON.stringify(publicUserInfo));
        res.cookie("isLoggedIn", "True", {maxAge: 3600000});
        
        res.status(200).json({user : user , Token : token});
        console.log("user created")


    }
    catch (err){
        console.log(err)
        res.status(500).json({errMsg : err ,
        systemMsg : "error with creating user.. pls try again"})
    }

})

//logout user by deleting cookie, rest of the redirecting to be handled by FE
router.route("/logout")
.post( auth, (req , res) => {
    try{
        // The 'jwt' cookie should exist at this point because the auth middleware has already checked it
        // Clear the cookie
        // Clear the 'token' and 'user' cookies
        res.clearCookie('token');
        res.clearCookie('user');
        res.clearCookie('userInfo')
        res.clearCookie('isLoggedIn')
        res.status(200).send('cookies deleted');
    }
    catch (err) {
        console.log(err)
        res.status(500).json({errMsg : err ,
        systemMsg : "error with logging out user.. pls try again"})
    }
})

router.get("/oauth/google", async (req, res) => {

    //get the code from qs
    const code = req.query.code;
    console.log('query code is', code)
    try {

    //get id and access token with code
    const { id_token, access_token } = await getGoogleOAuthTokens(code)
    console.log({id_token, access_token})
    const googleUser = jwt.decode(id_token)
    console.log(googleUser)

    // find the user, create one if not found
    const user = await User.findOne({googleId : googleUser.sub})
    if(user){
        //user found check give them a new jwt an cookie for their session
        console.log("User found" , user.username);
        console.log("Creatin cookie and jwt")
        const payload  = { 
            _id : user._id.toString(),
            username : user.username,
            date : Date.now()
        };
        const secret = APP_TOKEN;
        const token = jwt.sign (
            payload , secret , {expiresIn: '2h'}
        );
        // Set cookies
        const publicUserInfo = {
            picture : user.profileImageUrl,
            username : user.username,
        }
        res.cookie('token', token, { httpOnly: true });
        res.cookie('user', JSON.stringify(user), { httpOnly: true });
        res.cookie('userInfo' , JSON.stringify(publicUserInfo));
        res.cookie("isLoggedIn", "True", {maxAge: 3600000});
        //return res.redirect('/');
        
        return res.status(200).json({message : "User exists logging in" ,user : user , Bearer : token});

    }
    else {
        //uesr not found create a new user
        if(!googleUser.email_verified){
            return res.status(403).json("email not verified")
        }
        console.log("user not found")
        const newUser = await User.create({
        username : googleUser.name,
        email : googleUser.email.toLowerCase(),
        googleId : googleUser.sub,
        profileImageUrl : googleUser.picture
        })
        console.log("user created" , newUser)
        const payload  = { 
            _id : newUser._id.toString(),
            username : newUser.username 
        };
        const secret = APP_TOKEN;
        const token = jwt.sign (
            payload , secret , {expiresIn: '2h'}
        );
        console.log("user created")
        // Set cookies
        const publicUserInfo = {
            picture : newUser.profileImageUrl,
            username : newUser.username,
        }
        res.cookie('token', token, { httpOnly: true });
        res.cookie('user', JSON.stringify(user), { httpOnly: true });
        res.cookie('userInfo' , JSON.stringify(publicUserInfo));
        res.cookie("isLoggedIn", "True", {maxAge: 3600000});
        //return res.redirect('/');

        return res.status(201).json({message : "User created", user : newUser , Bearer : token});
      


    }
    } catch (error) {
        console.log(error , 'failed to auth user')
        console.log("change this to be handled by front end")
        return res.redirect(`${process.env.CLIENT_ORIGIN}/oauth/error`)
    }

})


module.exports = router

