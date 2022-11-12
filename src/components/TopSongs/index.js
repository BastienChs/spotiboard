import {memo, useContext, useEffect, useState} from 'react'
import {UserContext} from "../UserContext";
import axios from "axios";
import Vinyl from './icons8-vinyl-64.png'
import './style.css'
import AudioPlayer from "../AudioPlayer";

const TopSongs = () => {

    const value = useContext(UserContext);
    // const [isLoading, setIsLoading] = useState(true)
    const [topTracks, setTopTracks] = useState([])
    const [trackIsPlaying, setTrackIsPlaying] = useState(false)
    const [trackToPlay, setTrackToPlay] = useState({
        trackUri: '',
        trackCover: Vinyl
    })
    const getUserTopTracks = () => {
        if(localStorage.getItem('spotifyTopTracks') ){
            setTopTracks(JSON.parse(localStorage.getItem('spotifyTopTracks')))
        }else {
            axios.get('https://api.spotify.com/v1/me/top/tracks',
                {
                    headers:
                        {
                            'Authorization': 'Bearer ' + value
                        }
                })
                .then(resp => {
                    console.log(resp)
                    setTopTracks(resp.data)
                    localStorage.setItem('spotifyTopTracks', JSON.stringify(resp.data))
                })
                .catch(err => {
                    console.log(err)
                })
        }
        console.log(topTracks)
    }

    const listTopTracks =  (
        <>
             { topTracks.items &&
                topTracks.items.map((trackInfo, index) => {
                    return (
                        <li key={index} className="px-6 py-2 border-b border-gray-200 w-full">
                            <div className='grid grid-cols-4 gap-4'>
                                <div>
                                    <button onClick={() => changeCurrentTrack(trackInfo.preview_url, trackInfo.album.images[2].url)}>
                                        <img className="w-16 h-16 object-cover rounded border border-y-green-800"
                                         src={trackInfo.album.images[2].url} alt=""/>
                                    </button>
                                </div>
                                <div className={'col-span-3'}>
                                    <h5 className="text-gray-900 text-base font-medium mb-2">{trackInfo.name}</h5>
                                    <h6>
                                        {
                                            trackInfo.artists.map((artist) => {
                                                return(
                                                    <>
                                                        <a className={'text-gray-600 text-xs'} key={artist.id} target={'_blank'} rel={"noreferrer"} href={artist.external_urls.spotify}>
                                                            {artist.name}
                                                        </a>
                                                        {trackInfo.artists[trackInfo.artists.length-1] !== artist ? ' - ' : ''}
                                                    </>
                                                )
                                            })
                                        }
                                    </h6>
                                </div>
                            </div>
                        </li>
                    )
                })
            }
        </>
    )

    const changeCurrentTrack = (trackUri, trackCoverUri) => {
        setTrackToPlay({
            trackUri: trackUri,
            trackCover: trackCoverUri
        })
        setTrackIsPlaying(false)
    }

    useEffect(() => {
        getUserTopTracks()
    },[])

    return (
        <div className="grid grid-cols-3 gap-4 bg-red-600">
            <div className={'bg-gray-600'}>
                <div className="grid grid-cols-1 gap-4 m-5 justify-items-center">
                    {/*<div className={'player-div rounded-lg border border-gray-700 w-full p-5'}>*/}
                        {topTracks.items && <AudioPlayer tracks={topTracks.items}/>}
                        {/*<img className={`m-auto rounded-full p-1 ${trackIsPlaying && 'rotate'}`} alt={'Album of the song playing.'} src={trackToPlay.trackCover}/>*/}
                        {/*<audio className={"timeline w-full"} controls onPlay={() => setTrackIsPlaying(true)} onPause={() => setTrackIsPlaying(false)} src={trackToPlay.trackUri}></audio>*/}
                    {/*</div>*/}
                    <ul className="bg-white rounded-lg border border-gray-200 text-gray-900 w-full m-auto">
                        { listTopTracks }
                    </ul>
                </div>
            </div>
            <div className={'bg-pink-400'}>Charts</div>
            <div className={'bg-yellow-400'}>09</div>
        </div>
    )
}

export default memo(TopSongs)