const axios = require('axios')
const {OAuth2Client} = require('google-auth-library')
const qs = require('qs')
require("dotenv").config()

async function getGoogleOAuthTokens (code){
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
        code,
        client_id : process.env.CLIENT_ID,
        client_secret : process.env.CLIENT_SECRET,
        redirect_uri : process.env.GoogleOathURL,
        grant_type : 'authorization_code'
    }
    try {
        const res = await axios.post(url, qs.stringify(values), {
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        })
        return res.data
    } catch (error) {
        console.log({"error from functions file" : error})
        throw new Error(error);
    }
}

module.exports = {
    getGoogleOAuthTokens
};

