const jwt = require("jsonwebtoken") ;
require("dotenv").config();
const  { APP_TOKEN } = process.env;



const verifyToken = (req, res, next) => {
    // Get the token from the 'token' cookie
    const token = req.cookies.token;
    if (req.cookies.isLoggedIn) {
        res.cookie("isLoggedIn", "True", { maxAge: 3600000});
    }
    if (!token) {
        console.log("token invalid CHECK AUTHORIZATION HEADER")
        return res.status(402).json("A token is required for authentication")
    }


    jwt.verify(token , APP_TOKEN , function(err , decoded) {
        if(err){
            console.log("token invalid");
            return res.status(401).json({msg : err , errMsg : "invalid token - render invalid token page" });
        }
        //console.log("token is valid");
        //console.log('Decoded token in Auth Middleware', decoded);
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken 
