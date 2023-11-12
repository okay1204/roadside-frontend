"use client"

import Map from './components/Map'
import dynamic from 'next/dynamic'
import WebsocketListener from './components/WebsocketListener'
import { chat } from './utils/chat'
import { useState } from 'react'

// Import this way to prevent SSR
const SpeechToText = dynamic(() => import('./components/SpeechToText'), { ssr: false })

export default function Home() {
    const [sessionID, setSessionID] = useState<string>('');

    const handleListen = (data: any) => {
        // check if id exists. if it does, set the state
        if (data.id) {
            setSessionID(data.id);
            return
        }

        // check if data.gpts exists
        if (!data.gpts) {
            return;
        }

        // loop through each object in data.gpts
        console.log(data)
        const gpts = data.gpts;
        gpts.forEach((element: any) => {
            if (element.action === true) {
                chat(sessionID, `Repeat this back to me: ${element.desc}`)
            }
        });
    }

    return (
        <main>
            <SpeechToText />
            <Map />
            <WebsocketListener callback={handleListen} />
        </main>
    )
}
