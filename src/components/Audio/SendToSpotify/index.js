import './style.css'
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {UserContext} from "../../UserContext";

const SendToSpotify = (props) => {

    const value = useContext(UserContext);
    const [topTracks, setTopTracks] = useState({})

    useEffect(() => {
        setTopTracks(JSON.parse(localStorage.getItem('spotifyTopTracks')))
    }, [])

    const playTrackOnSpotify = trackId => {
        let currentTrack = topTracks.items.find(track => track.id === trackId);
        let albumId = currentTrack.album.id
        let contextUri = 'spotify:album:' + albumId
        let position = currentTrack.track_number-1
        axios.put('https://api.spotify.com/v1/me/player/play',
    {
            context_uri: contextUri,
            offset: {
                "position": position
            },
            position_ms: 0,
        },
  {
            headers:
                {
                    'Authorization': 'Bearer ' + value
                }
        }).then(resp => {
        }).catch(err => {
            console.log(err)
        })
    }


    return(
        <button onClick={() => playTrackOnSpotify(props.trackId)} className={'mt-1 btn-send-spotify'}>Play complete song on Spotify</button>
    )
}

export default SendToSpotify