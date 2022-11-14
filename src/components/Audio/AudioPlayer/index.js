import {useEffect, useRef, useState} from "react";
import AudioControls from '../AudioControls';
import './style.css'
import SendToSpotify from "../SendToSpotify";

//Based on the wonderful work of Ryan Finn (https://letsbuildui.dev/articles/building-an-audio-player-with-react-hooks)
const AudioPlayer = ({tracks}) => {
    const [trackIndex, setTrackIndex] = useState(0);
    const [trackProgress, setTrackProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRotateCoverActivated, setIsRotateCoverActivated] = useState(true);
    const [playerHasBeenActivated, setPlayerHasBeenActivated] = useState(false)

    // Destructure for conciseness
    // const { title, artist, color, image, audioSrc } = tracks[trackIndex];
    const {id, name, artists, album, preview_url, external_urls} = tracks[trackIndex]

    // Refs
    const audioRef = useRef(new Audio(preview_url));
    const intervalRef = useRef();
    const isReady = useRef(false);

    // Destructure for conciseness
    const { duration } = audioRef.current;

    const currentPercentage = duration ? `${(trackProgress / duration) * 100}%` : '0%';
    const trackStyling = `-webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))`;

    const toPrevTrack = () => {
        if (trackIndex - 1 < 0) {
            setTrackIndex(tracks.length - 1);
        } else {
            setTrackIndex(trackIndex - 1);
        }
    }

    const toNextTrack = () => {
        if (trackIndex < tracks.length - 1) {
            setTrackIndex(trackIndex + 1);
        } else {
            setTrackIndex(0);
        }
    }

    const artistLinks = artists.map((artist,index) => {
        const separator = artists[artists.length-1] === artist ? '' : ', '
        return (<a className={'artist-link'} href={artist.external_urls.spotify} key={index} target={'_blank'} rel={"noreferrer"}>{artist.name}{separator}</a>)
    })
    const artistStrings = artists.map(artist=>{return artist.name}).join(', ')


    const startTimer = () => {
        // Clear any timers already running
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (audioRef.current.ended) {
                toNextTrack();
            } else {
                setTrackProgress(audioRef.current.currentTime);
            }
        }, [1000]);
    }

    const onScrub = (value) => {
        // Clear any timers already running
        clearInterval(intervalRef.current);
        audioRef.current.currentTime = value;
        setTrackProgress(audioRef.current.currentTime);
    }

    const onScrubEnd = () => {
        // If not already playing, start
        if (!isPlaying) {
            setIsPlaying(true);
        }
        startTimer();
    }

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
            startTimer();
        } else {
            clearInterval(intervalRef.current);
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        // Pause and clean up on unmount
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        }
    }, []);

    // Handle setup when changing tracks
    useEffect(() => {
        audioRef.current.pause();

        audioRef.current = new Audio(preview_url);
        setTrackProgress(audioRef.current.currentTime);

        if(!playerHasBeenActivated && trackIndex > 0)
            setPlayerHasBeenActivated(true)

        if (isReady.current && (playerHasBeenActivated || (!playerHasBeenActivated && trackIndex > 0))) {
            audioRef.current.play();
            setIsPlaying(true);
            startTimer();
        } else {
            // Set the isReady ref as true for the next pass
            isReady.current = true;
        }
    }, [trackIndex]);

    return(
       <div className="audio-player w-full h-full">
            <div className="track-info">
                <div className={'top-info-track'}>
                    <span className={'inline-block absolute left-2'}>#{trackIndex+1}/20</span>
                    <div className="flex justify-center inline-block absolute right-2">
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input radio-btn-spotiboard appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                                type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={isRotateCoverActivated} onChange={()=> setIsRotateCoverActivated(!isRotateCoverActivated)}/>
                        </div>
                    </div>
                </div>
                <div className={'body-info-track pt-10 '}>
                    <img
                        className={`artwork border border-green-600 ${isPlaying && isRotateCoverActivated ? 'rotate' : ''}`}
                        src={album.images[1].url}
                        alt={`track artwork for ${name} by ${artistStrings}`}
                    />
                    <h2 className="title pt-1"><a href={external_urls.spotify} target={'_blank'} rel={"noreferrer"}>{name}</a></h2>
                    <h3 className="album mt-2"><a href={album.external_urls.spotify} target={'_blank'} rel={"noreferrer"}>{album.name}</a></h3>
                    <h3 className="artist mb-2">{artistLinks}</h3>
                    <AudioControls
                        isPlaying={isPlaying}
                        onPrevClick={toPrevTrack}
                        onNextClick={toNextTrack}
                        onPlayPauseClick={setIsPlaying}
                    />
                    <input
                        type="range"
                        value={trackProgress}
                        step="1"
                        min="0"
                        max={duration ? duration : `${duration}`}
                        className="progress"
                        onChange={(e) => onScrub(e.target.value)}
                        onMouseUp={onScrubEnd}
                        onKeyUp={onScrubEnd}
                        style={{ background: trackStyling }}
                    />
                    <SendToSpotify trackId={id}/>
                </div>
            </div>
        </div>
    )

}

export default AudioPlayer