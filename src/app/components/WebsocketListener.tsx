'use client'
import { FC, useEffect } from "react";
import useWebSocket from 'react-use-websocket';

interface WebsocketListenerProps {
    // props
    callback: (data: any) => void
}

const WebsocketListener: FC<WebsocketListenerProps> = ({ callback }) => {
    const { lastJsonMessage } = useWebSocket('ws://127.0.0.1:8000/websocket?location_1=37.75553&location_2=-122.41766')
    
    useEffect(() => {
        if (lastJsonMessage !== null) {
            callback(lastJsonMessage);
        }
    }, [callback, lastJsonMessage]);

    return (
        <></>
    );
};

export default WebsocketListener;