"use client"
//@ts-nocheck
import { FC, useEffect} from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { MAPBOX_ACCESS_TOKEN } from "@/app/utils/constants";
import {AddressAutofillCore, SessionToken, SearchBoxCore} from '@mapbox/search-js-core'
import { useContext } from "react";
import { MapContext } from "./Map";
import { chat } from "../utils/chat";



interface TextProps { }

const SpeechToText: FC<TextProps> = ({ }) => {
    const {route, currentLocation, sessionID, setIsListening} = useContext(MapContext)

    const commands = [{
        command: "Roadside *",
        callback: async (command: any) => {
            console.log(`${command}`)
            
            let confirmation = new Audio('http://localhost:8000/static/Blow.mp3')
            confirmation.play()

            if (command.split(" ").includes("parking")){
                console.log("finding parking")

                const park_response = {
                action: "park",
                asst_resp: {
                    metadata: {
                            action_result: {
                                result: [{
                                    point : {
                                        type: "Point",
                                        coordinates: [
                                        -122.469128,
                                        37.77148
                                        ]
                                    },
                                    }
                                ]
                            }
                        }
                    }
                }

                const result = park_response.asst_resp.metadata.action_result
                if (park_response.action === "park"){
                    const longitude = result.result[0].point.coordinates[0]
                    const latitude = result.result[0].point.coordinates[1]
                    const location = {
                        longitude: longitude,
                        latitude: latitude,
                    }
                    console.log("location", location)
                    route([location])
                }

                // return 
            }

            // api response
            console.log("sessionID: ", sessionID)
            const response = await chat(sessionID, command)
            const responseText = JSON.parse(response.response_text)
            console.log("response: ", Object.keys(response))
            console.log("response: ", response)
            console.log("response_text: ", response.response_text)
            console.log("response_text: ", JSON.parse(response.response_text))
            console.log("ttl_url: ", response.tts_url)
            console.log("metadata: ", response.metadata)
            
            // play confirmation
            if (response.tts_url){
                const audio = new Audio(response.tts_url);
                audio.play()
            }

            // const stop_response = {
            //     action: "add_stop",
            //     details: ["Taco Bell"],
            //     asst_resp: "Sure, I've added Taco Bell as a stop. Is there anything else you need help with?"
            // }
            // console.log("response: ", stop_response)
            
            // const locations = response.details.map(addStopCoordinates)
            if (responseText.action === "add_stop"){
                if (typeof responseText.details === 'string') {
                    responseText.details = [responseText.details]
                }
                console.log("response.details: ", responseText.details)
                const locations = await Promise.all(responseText.details.map(addStopCoordinates));
                console.log("locations: ", locations)
                route(locations)
            }
            SpeechRecognition.startListening()


            // const result = response.asst_resp.metadata.action_result
            // if (response.action === "park"){
            //     const longitude = result.result[0].point.coordinates[0]
            //     const latitude = result.result[0].point.coordinates[1]
            //     const location = {
            //         longitude: longitude,
            //         latitude: latitude,
            //     }
            //     console.log("location", location)
            //     route([location])
            // }
        }
    }]

    const addStopCoordinates = async (location: string) => {
        const search = new SearchBoxCore({ accessToken: MAPBOX_ACCESS_TOKEN});

        const sessionToken = new SessionToken();
        const result = await search.suggest(location, { sessionToken });
        if (result.suggestions.length === 0) return;

        const suggestion = result.suggestions[0];
        const { features } = await search.retrieve(suggestion, { sessionToken });
        return {
            longitude: features[0].geometry.coordinates[0],
            latitude: features[0].geometry.coordinates[1]
        }
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

    useEffect(() => {
        if (listening === false){
            // process text
            // console.log(transcript)
            // console.log("interimTranscript: ", interimTranscript)
            // console.log("finalTranscript: ", finalTranscript)
            setIsListening(true)
            SpeechRecognition.startListening();
        } else {
            // setIsListening(false)
            // console.log("transcript: ", transcript)
        }
    },[listening])

    return (
        <div className="text-black">
            <span className="ml-2 font-bold text-xl bg-base-100">Input: {transcript}</span>
        </div>
    );
};

export default SpeechToText;
