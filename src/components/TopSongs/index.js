import {memo, useContext, useEffect, useState} from 'react'
import {UserContext} from "../UserContext";
import axios from "axios";
import './style.css'
import AudioPlayer from "../Audio/AudioPlayer";
import queryString from "query-string";

const TopSongs = (props) => {

    const value = useContext(UserContext);
    const [topTracks, setTopTracks] = useState({})
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
                    setTopTracks(resp.data)
                    localStorage.setItem('spotifyTopTracks', JSON.stringify(resp.data))
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const listTopTracks =  (
        <>
             { topTracks.items &&
                topTracks.items.map((trackInfo, index) => {

                    const artistLinks = trackInfo.artists.map((artist, index) => {
                            const separator = trackInfo.artists[trackInfo.artists.length - 1] === artist ? '' : ', '
                            return (<a className={'text-gray-300 text-xs'} href={artist.external_urls.spotify} key={index} target={'_blank'}
                                       rel={"noreferrer"}>{artist.name}{separator}</a>)
                        })

                    const artistStrings = trackInfo.artists.map(artist=>{return artist.name}).join(', ')
                    const selectedSong = props.selectedIdsSong.includes(trackInfo.id)
                    return (
                        <li key={index} onClick={() => props.clickSongEvent(trackInfo.id)} className={`rounded ${selectedSong ? 'selected-track-list' : 'track-list' } px-6 py-2 m-1 mt-2 border-gray-200 w-full`}>
                            <div className='grid grid-cols-4 gap-4'>
                                <div>
                                    <img className="w-16 h-16 object-cover"
                                         src={trackInfo.album.images[2].url} alt={`track artwork for ${trackInfo.name} by ${artistStrings}`}/>
                                </div>
                                <div className={'col-span-3'}>
                                    <h5 className="text-white text-base font-medium">
                                        <a href={trackInfo.external_urls.spotify} target={'_blank'} rel={"noreferrer"}>
                                            {trackInfo.name}
                                        </a>
                                    </h5>
                                    <h6 className="text-gray-200 text-sm">
                                        <a href={trackInfo.album.external_urls.spotify} target={'_blank'} rel={"noreferrer"}>
                                            {trackInfo.album.name}
                                        </a>
                                    </h6>
                                    <h6>
                                        {
                                            artistLinks
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

    const getUserTopTracksDetailedDatas = () => {
        if (topTracks.items && topTracks.items.length > 0 && localStorage.getItem('spotifyTopTracksDetailedDatas') === null){
            const topTracksIds = topTracks.items.map(topTrack => {
                return topTrack.id
            })
            const uri = ('https://api.spotify.com/v1/audio-features?' +
                queryString.stringify({
                    ids: topTracksIds.join(','),
                }));
            axios.get(uri,
                {
                    headers:
                        {
                            'Authorization': 'Bearer ' + value
                        }
                })
                .then(resp => {
                    localStorage.setItem('spotifyTopTracksDetailedDatas', JSON.stringify(resp.data))
                })
                .catch(err => {
                    console.log('err on fecthing audio features',err)
                })
        }
    }

    useEffect(() => {
        getUserTopTracks()
    },[])

    useEffect(() => {
        if(topTracks.items)
            getUserTopTracksDetailedDatas()
    },[topTracks])

    return (

            <div className={'bg-gray-600'}>
                <div className="grid grid-cols-1 gap-4 m-5 justify-items-center">
                        {topTracks.items && <AudioPlayer tracks={topTracks.items}/>}
                    <ul className="bg-transparent text-gray-900 w-full m-auto">
                        { listTopTracks }
                    </ul>
                </div>
            </div>
    )
}

export default memo(TopSongs)