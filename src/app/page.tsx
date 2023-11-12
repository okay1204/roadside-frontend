"use client"

import Map from './components/Map'
// import SpeechToText from './components/SpeechToText'
import dynamic from 'next/dynamic'
import WebsocketListener from './components/WebsocketListener'
import { chat } from './utils/chat'
import { useState } from 'react'

// Import this way to prevent SSR
const SpeechToText = dynamic(() => import('./components/SpeechToText'), { ssr: false })

export default function Home() {
    const [sessionID, setSessionID] = useState<string>('');
    const [latestData, setLatestData] = useState<any>({}); // latest data from websocket

    const handleListen = (data: any) => {
        console.log('RECIEvED WEBSOCKET')
        // check if id exists. if it does, set the state
        if (data.id) {
            setSessionID(data.id);
            return
        }

        // check if data.gpts exists1
        if (!data.gpts) {
            return;
        }

        // loop through each object in data.gpts
        const gpts = data.gpts;
        gpts.forEach((element: any) => {
            if (element.action === true) {
                chat(sessionID, `Repeat this back to me: ${element.desc}`)
                .then((res) => {
                    setLatestData(res);
                })
            }
        });
    }

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-[#2A2D34]">
            <Map sessionID={sessionID} latestData={latestData} setLatestData={setLatestData}/>
            <WebsocketListener callback={handleListen} />
        </div>
    )
}
