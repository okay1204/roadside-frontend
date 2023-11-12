"use client"

import Map from './components/Map'
// import SpeechToText from './components/SpeechToText'
import dynamic from 'next/dynamic'

// Import this way to prevent SSR
const SpeechToText = dynamic(() => import('./components/SpeechToText'), { ssr: false })

export default function Home() {

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-800">
            <Map/>
            {/* <SpeechToText/> */}
        </div>
    )
}
