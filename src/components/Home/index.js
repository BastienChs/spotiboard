import {Fragment, useEffect, useState} from "react";
import TopSongs from "../TopSongs";
import {UserContext} from "../UserContext";
import {useNavigate} from "react-router-dom";
import Header from "../Header";
import {SpotifyToken} from "../Shared/StoreSpotifyToken";
import {useCookies} from "react-cookie";
import RadarChart from "../TrackRadarChart";


const Home = () => {

    const navigate = useNavigate()
    const [spotifyTokenCookies,] = useCookies(['spotify-token']);
    const [selectedIdSongForRadarChart, setSelectedIdSongForRadarChart] = useState([])

    const updateSelectedIdSong = (id) => {
        // setNames(current => [...current, 'Carl']);
        if(!selectedIdSongForRadarChart.includes(id)){
            setSelectedIdSongForRadarChart(current => [...current, id])
        }
        else{
            let current = [...selectedIdSongForRadarChart]; // make a separate copy of the array
            let index = current.indexOf(id)
            if (index !== -1) {
                current.splice(index, 1);
                setSelectedIdSongForRadarChart(current);
            }
        }
        console.log('new id selected song: ', id)
    }

    useEffect(() => {
         if(!spotifyTokenCookies || !spotifyTokenCookies.tokenSpotify)
             navigate('/login')
    },[])

    return(
        <Fragment>
            <UserContext.Provider value={SpotifyToken}>
                <Header/>
                <div className="grid grid-cols-3 gap-4 bg-gray-600 ">
                    <TopSongs selectedIdsSong={selectedIdSongForRadarChart} clickSongEvent={updateSelectedIdSong}/>
                    {/*<TracksDataChart/>*/}
                    <RadarChart selectedIdsSong={selectedIdSongForRadarChart}/>
                    <div></div>
                </div>
            </UserContext.Provider>
        </Fragment>
    )
}

export default Home