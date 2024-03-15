const express = require("express")
const mongoDatabase = require("./configs/database")
const app = express()
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")
const cors = require('cors');
require("dotenv").config()
const  { APP_TOKEN } = process.env

const { MONGO_URI } = process.env

function refreshCookie(req , res , next){
    if(req.cookies.jwt){
		res.cookie('jwt' , req.cookies.jwt , {httpOnly : true , secure : true , maxAge : 1000 * 60 * 60 * 24 * 7})
    }
    next();
}
const corsOptions = {
	origin : process.env.CLIENT_ORIGIN,
	credentials: true,

};
//middleware
//parse application/json and look for raw text                                        
app.use(express.json());                                     
app.use(express.urlencoded({extended: true}));               
app.use(express.text());                                    
app.use(cookieParser())
app.use(cors(corsOptions))
const authController = require('./routes/authController')
const postController = require("./routes/postsController")
const profileController = require("./routes/profileController")

const auth = require("./middleware/auth")
app.use(authController)
app.use(postController)
app.use(profileController)
//app.use(refreshCookie)
mongoDatabase.connect(MONGO_URI)
//console.log = function() {};

const port = process.env.PORT || 3000;

function verifyLoggedIn(token) {
    jwt.verify(token , APP_TOKEN , function(err , decoded) {
   	if(err) return false
	return true
})
};

const testData = [ 
	{ 
		username : "edward" ,
		information : "only for edward"
	},
	{ 
		username : "jimmy" ,
		information : "only for jimmy"
	},

]
app.get("/testAuthRoute" , auth , (req , res) => {
	res.status(200).json("AUTH is working")
})

app.get('/', (req, res) => {
	if(verifyLoggedIn(req.cookies)){

		res.status(200).json(testData.filter( data => data.username === req.user.username))
	}
		res.status(200).json("Need to Login")

})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)	
})

module.exports = app; //for testing