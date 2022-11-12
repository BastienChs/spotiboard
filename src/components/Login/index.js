import {Component, Fragment} from "react";


const redirect_uri = 'http://localhost:3000/callback'
const queryString = require('query-string');

function generateRandomString(number) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < number; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const getSpotifyLoginUrl = () => {
    let state = generateRandomString(16);
    let scope = 'user-read-email user-read-private user-read-playback-position user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public ugc-image-upload';

    const uri = ('https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'code',
            client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
    console.log(uri)
    return uri
}

class Login extends  Component{

    componentDidMount() {
        console.log(getSpotifyLoginUrl())

    }

    render (){
        return(
            <Fragment>
                <a href={getSpotifyLoginUrl()} target={'_blank'} rel="noreferrer">Login</a>
            </Fragment>
        )
    }
}

export default Login