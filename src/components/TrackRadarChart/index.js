//TODO
//Add a radar chart related to parent state, the goal is to display the various data related to the song clicked
import React, {useEffect, useState} from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import axios from "axios";
import './style.css'

const TrackRadarChart = (props) => {

    const [topTracks, setTopTracks] = useState({})
    const [topTracksDetailedDatas, setTopTracksDetailedDatas] = useState([])
    const [radarProperties, setRadarProperties] = useState([])
    const [dataset, setDataset] = useState([
        {
            label: 'Danceability',
            fullMark: 1,
        },
        {
            label: 'Energy',
            fullMark: 1,
        },
        {
            label: 'Speechiness',
            fullMark: 1,
        },
        {
            label: 'Acousticness',
            fullMark: 1,
        },
        {
            label: 'Liveness',
            fullMark: 1,
        },
        {
            label: 'Valence',
            fullMark: 1,
        },
    ])

    const getRandomColor = (idTrack) => {
        axios.get(`https://www.colr.org/json/color/random?query&timestamp=${new Date().getTime()}`)
            .then(resp => {setRadarProperties(radarProperties.map(currentRadarProperties=>{
                if(currentRadarProperties.id === idTrack) {
                        return {...currentRadarProperties, color: `#${resp.data.new_color}`, updatedColor: true};
                    }
                    return currentRadarProperties
                }))
            })
            .catch(err => {
                console.log('err on fecthing audio features', err)
            })
    }

    useEffect(() => {
        setRadarProperties([])
        setTopTracks(JSON.parse(localStorage.getItem('spotifyTopTracks')))
        setTopTracksDetailedDatas(JSON.parse(localStorage.getItem('spotifyTopTracksDetailedDatas')))
        retrieveData()
    },[])

    useEffect(() => {
        cleanOldDatas()
        retrieveData()
    },[props.selectedIdsSong])

    const retrieveData = () => {
        props.selectedIdsSong.map((currentId)=>{
            if(!radarProperties.some(e => e.id === currentId)) {
                let resultTrackInfo = topTracks.items.find(item => item.id === currentId);
                let audioDetails = topTracksDetailedDatas.audio_features.find(item => item.id === currentId);

                setDataset(dataset.map(currentData => {
                    let currentProperty = currentData.label.toLowerCase()
                    return {...currentData, [resultTrackInfo.id]: audioDetails[currentProperty]};
                }))

                setRadarProperties(current => [...current, {
                    id: currentId,
                    name: resultTrackInfo.name,
                    dataKey: currentId,
                    color: '#FFFFFF',
                    updatedColor: false
                }])
                return true
            }
            return true
        })

    }

    const cleanOldDatas = () => {
        setRadarProperties((state) => state.filter((item) => props.selectedIdsSong.includes(item.id)))
    }

    useEffect(() => {
        if(radarProperties.length > 0) {
            getRandomColor(radarProperties[radarProperties.length - 1].id)
        }
    }, [radarProperties.length])

    useEffect(() => {
        console.log(dataset)
    }, [dataset])

    const radars = radarProperties.map((currentRadar, id) => {
        console.log(radarProperties)
        const {name, dataKey, color} = currentRadar
        return (<Radar key={id} keyPoints={dataKey} name={name} dataKey={dataKey} stroke={color} fill={color}
                       fillOpacity={0.5}/>)
    })
    return(
        <div className="grid grid-cols-1 gap-4 m-5 justify-start">
            {
                radarProperties.length > 0 &&  (
                    <div className={'chart-container'}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dataset}>
                                <PolarGrid/>
                                <PolarAngleAxis dataKey="label"/>
                                <PolarRadiusAxis/>
                                { radars }
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
            <div></div>
        </div>
    )
}
export default TrackRadarChart