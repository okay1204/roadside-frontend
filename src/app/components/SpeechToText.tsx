"use client"
//@ts-nocheck
import { FC, useEffect} from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { MAPBOX_ACCESS_TOKEN } from "@/constants";
import {AddressAutofillCore, SessionToken, SearchBoxCore} from '@mapbox/search-js-core'


interface TextProps { }

const SpeechToText: FC<TextProps> = ({ }) => {
    const commands = [{
        command: "Roadside *",
        callback: (command: any) => {
            console.log(`${command}`)
            // api response = {}
            
            // SpeechRecognition.startListening()
        }
    }]

    const addStopCoordinates = async (location: any) => {
        const search = new SearchBoxCore({ accessToken: 'pk.my-mapbox-access-token' });

        const sessionToken = new SessionToken();
        const result = await search.suggest(location, { sessionToken });
        if (result.suggestions.length === 0) return;

        const suggestion = result.suggestions[0];
        const { features } = await search.retrieve(suggestion, { sessionToken });
        return features
    }

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition({commands});

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser does not support speech recognition.</span>;
    }

    // while(1){
    //     SpeechRecognition.startListening()
    // }



    useEffect(() => {
        if (listening === false){
            // process text
            // console.log(transcript)
            // console.log("interimTranscript: ", interimTranscript)
            // console.log("finalTranscript: ", finalTranscript)

            // SpeechRecognition.startListening()
            SpeechRecognition.startListening();
        }
        // SpeechRecognition.startListening({ continuous: true });

    },[listening])

    return (
        <div>
            <h1 className="lg:text-5xl font-bold underline decoration-wavy text-2xl">
                Speech to text
            </h1>
            <span className="ml-2 font-bold text-xl bg-base-100">generated text: {transcript}</span>
            <p className="mb-2 text-xl font-bold">Microphone: {listening ? 'Listing to your voice..' : 'off'}</p>
            <div className="flex gap-3">
                <button className="btn btn-primary btn-sm" onClick={() => SpeechRecognition.startListening()}>Start</button>
                <button className="btn btn-secondary btn-sm" onClick={SpeechRecognition.stopListening}>Stop</button>
                <button className="btn btn-accent btn-sm" onClick={resetTranscript}>Reset</button>
            </div>
        </div>
    );
};

export default SpeechToText;
