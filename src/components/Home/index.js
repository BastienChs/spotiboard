import {Fragment, useEffect} from "react";
import TopSongs from "../TopSongs";
import {SpotifyToken} from '../StoreSpotifyToken'
import {UserContext} from "../UserContext";
import {useNavigate} from "react-router-dom";
import Header from "../Header";


const Home = () => {

    const navigate = useNavigate()

    useEffect(() => {
        if(SpotifyToken === null || SpotifyToken === undefined)
            navigate('/login')
    })

    return(
        <Fragment>
            <UserContext.Provider value={SpotifyToken}>
                <Header/>
                <TopSongs/>
            </UserContext.Provider>
        </Fragment>
    )
}

export default Home