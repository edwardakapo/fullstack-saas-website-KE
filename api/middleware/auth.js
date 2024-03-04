const jwt = require("jsonwebtoken") ;
require("dotenv").config();
const  { APP_TOKEN } = process.env;



const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("token invalid CHECK AUTHORIZATION HEADER")
        return res.status(402).json("A token is required for authentication")
    }

    const token = authHeader.split(' ')[1]; // Extract the JWT from the Authorization header

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
