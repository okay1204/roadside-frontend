import React, {useContext} from 'react';
import { MapContext } from './Map';

const InfoNavigator = ({ duration, distance}: any) => {
    const {reset, setReset} = useContext(MapContext)

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);

    const distanceInMiles = (distance * 0.000621371).toFixed(2);

    const now = new Date();
    const arrivalTime = new Date(now.getTime() + duration * 1000);
    const formattedArrivalTime = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-[#0A0A0A] px-[2rem] flex items-center justify-between">
        <div>
            {hours > 0 && <p className='text-white font-semibold'>{hours}h</p>}
            <p className='text-white font-semibold'>{minutes} min</p>
            <p className='text-white font-semibold'>{formattedArrivalTime}</p>
            <p className='text-white font-semibold'>{distanceInMiles} km</p>
        </div>
        <button onClick={() => setReset(!reset)} className="bg-red-500 text-white px-4 py-2 rounded-[2rem]">
            End Navigation
        </button>
        </div>
    );
};

export default InfoNavigator;
