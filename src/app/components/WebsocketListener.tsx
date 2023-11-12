'use client'
import { FC, useEffect, useState } from "react";
import useWebSocket from 'react-use-websocket';

interface WebsocketListenerProps {
    // props
    callback: (data: any) => void
}

const WebsocketListener: FC<WebsocketListenerProps> = ({ callback }) => {
    const { lastJsonMessage } = useWebSocket('ws://127.0.0.1:8000/websocket?location_1=37.75553&location_2=-122.41766')
    const [ lastMessageTime, setLastSpokenTime ] = useState<number>(0);
    
    useEffect(() => {
        if (lastJsonMessage !== null && Date.now() - lastMessageTime > 15000) {
            callback(lastJsonMessage);
            setLastSpokenTime(Date.now());
        }
    }, [callback, lastJsonMessage, lastMessageTime, setLastSpokenTime]);

    return (
        <></>
    );
};

export default WebsocketListener;