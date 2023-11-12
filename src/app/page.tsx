"use client"

import Map from './components/Map'
// import SpeechToText from './components/SpeechToText'
import dynamic from 'next/dynamic'
import WebsocketListener from './components/WebsocketListener'
import { chat } from './utils/chat'
import { useState } from 'react'
import Hazard from './components/Hazard'

// Import this way to prevent SSR
const SpeechToText = dynamic(() => import('./components/SpeechToText'), { ssr: false })

export default function Home() {
    const [sessionID, setSessionID] = useState<string>('');
    const [latestData, setLatestData] = useState<any>({}); // latest data from websocket
    const [hazardVisible, setHazardVisible] = useState(false);
    const showHazard = () => {
        setHazardVisible(!hazardVisible);
    };
    

    const handleListen = (data: any) => {
        console.log('RECEIVED WEBSOCKET')
        // check if id exists. if it does, set the state
        console.log("data: ", data)
        if (data.id) {
            setSessionID(data.id);
            return
        }

        // check if data.gpts exists
        if (!data.gpts) {
            return;
        }

        // loop through each object in data.gpts
        const gpts = data.gpts;
        console.log(gpts)
        if (gpts[0].action || gpts[1].action){
            setHazardVisible(true)
        } else {
            setHazardVisible(false)
        }
        gpts.forEach((element: any) => {
            if (element.action === true) {
                // setHazardVisible(true)
                chat(sessionID, `Repeat this back to me: ${element.desc}`)
                .then((res) => {
                    let audio = new Audio(res.tts_url);
                    console.log(audio)
                    audio.play();
                    setLatestData(res);
                })
            }
        });
    }

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-[#2A2D34]">
            {hazardVisible && (<Hazard/>)}
            <Map sessionID={sessionID} latestData={latestData} setLatestData={setLatestData}/>
            <WebsocketListener callback={handleListen} />
        </div>
    )
}
