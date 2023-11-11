"use client"

import Map from './components/Map'
import dynamic from 'next/dynamic'

// Import this way to prevent SSR
const SpeechToText = dynamic(() => import('./components/SpeechToText'), { ssr: false })

export default function Home() {

    return (
        <main>
            <SpeechToText />
            <Map />
        </main>
    )
}
