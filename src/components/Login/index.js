import {Fragment, useEffect} from "react";
import {SpotifyToken} from "../Shared/StoreSpotifyToken";
import {useNavigate} from "react-router-dom";

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

    return ('https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'code',
            client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
}

const Login = () => {

    const navigate = useNavigate()


    useEffect(()=>{
        if(SpotifyToken !== null && SpotifyToken !== undefined && SpotifyToken !== '') {
            console.log('token from login', SpotifyToken)
            navigate("/home");
        }
    },[])


    return(
        <Fragment>
            <section className="h-screen">
                <div className="container px-6 py-12 h-full">
                    <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
                        <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
                            <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                                className="w-full"
                                alt="Phone"
                            />
                        </div>
                        <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
                            <h2 className={'title text-lg uppercase'}>Welcome on Spotiboard !</h2>
                            <p className={'text-justify text-gray-600 mt-5'}>This webapp is designed to show you various data related to your spotify account,
                                such as: most listened tracks, most listened artists, favorites kind of music and so on.
                                All you need to do is to click the button bellow and you'll be able to discover a brand new way to see your Spotify
                                data !</p>

                            <a
                                href={getSpotifyLoginUrl()}
                                className="text-center inline-block mt-5 px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                                data-mdb-ripple="true"
                                data-mdb-ripple-color="light"
                            >
                                Sign in with Spotify
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )

}

export default Login