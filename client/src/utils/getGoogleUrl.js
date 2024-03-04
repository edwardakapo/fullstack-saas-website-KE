function getGoogleOAuthURL(){

    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

    const options = {
        redirect_uri: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL,
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: 'profile email',
    };
    console.log({options});
    const queryString = new URLSearchParams(options);
    console.log({queryString});
    return `${rootUrl}?${queryString.toString()}`
};

export default getGoogleOAuthURL

