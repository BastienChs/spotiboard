import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {Buffer} from  'buffer'

const SpotifyCallback = () => {
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams();
    const redirectUri = 'http://localhost:3000/callback'
    const code = searchParams.get("code")

    //We want to store the token securely in cookies for exemple
    const [spotifyTokenCookies, setSpotifyTokenCookie, removeSpotifyTokenCookie] = useCookies(['spotify-token']);

    useEffect(() => {
        axios.post('https://accounts.spotify.com/api/token',
            new URLSearchParams({
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
                client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
                client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
            })
            ,{
                headers:{
                    'Authorization': 'Basic ' + (new Buffer(process.env.REACT_APP_SPOTIFY_CLIENT_ID + ':' + process.env.REACT_APP_SPOTIFY_CLIENT_SECRET).toString('base64')),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(r =>{
            let {access_token, expires_in} = r.data
            let date = new Date
            date.setSeconds(date.getSeconds() + expires_in)
            if(r.status === 200 && access_token !== null) {
                setSpotifyTokenCookie('tokenSpotify', access_token, {
                    expires: date,
                    secure: true
                })
                navigate('/home')
            }
        }).catch(err => {
            console.log(err)
        })
    })

}

export default SpotifyCallback