"use client";
import React, { useEffect, useRef, useState, createContext } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_ACCESS_TOKEN } from "@/app/utils/constants";
import { getRoute } from "@/api/mapbox";
import { SearchBox } from "@mapbox/search-js-react";
import { isObjectEmpty } from "@/app/utils/helpers";
// import Hazard from "./Hazard";
import SpeechToText from "./SpeechToText";
// import WebsocketListener from "./WebsocketListener";
import StepsNavigator from "./StepsNavigator";
import InfoNavigator from "./Info";

export const MapContext = createContext<any>({});

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface GeolocationPosition {
  coords: {
    sessionID: string;
    latitude: number;
    longitude: number;
  };
}

const Map = ({ sessionID, latestData, setLatestData }: { sessionID: string, latestData: any, setLatestData: (data: any) => void }) => {
  const [map, setMap] = useState<any>();
  const [currentLocation, setCurrentLocation] = useState<any>({});
  const [destination, setDestination] = useState<any>({});
  // const [steps, setSteps] = useState<any>([]);
  const [results, setResults] = useState<any>({});
  const [isListening, setIsListening] = useState<boolean>(false)
  // const [hazardVisible, setHazardVisible] = useState(false);
  const [reset, setReset] = useState(false)


  const mapContainerRef = useRef(null);

  useEffect(() => {
    // create map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/traffic-night-v2",
      center: [0, 0],
      zoom: 0,
    });

    // map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    map.addControl(geolocate);

    setMap(map); // set map

    map.on("load", () => {
      geolocate.trigger();
      // // map.addControl(new MapboxTraffic());
    });

    // go to user's location
    geolocate.on("geolocate", (e) => {
      const position = e as GeolocationPosition;
      setCurrentLocation({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      });
      map.flyTo({
        center: [position.coords.longitude, position.coords.latitude],
        essential: true,
        zoom: 15,
      });

      // if user's location cannot be determined default to 0,0 and add pin there
      // else add pin of user's current location
      if (!map.getSource("user-location")) {
        map.addSource("user-location", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                position.coords.longitude,
                position.coords.latitude,
              ],
            },
          },
        });

        map.addLayer({
          id: "user-location",
          type: "circle",
          source: "user-location",
          paint: {
            "circle-radius": 5,
            "circle-color": "#007cbf",
          },
        });
      } else {
        map.getSource("user-location").setData({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [position.coords.longitude, position.coords.latitude],
          },
        });
      }
    });

    if (!isObjectEmpty(destination)){
      setDestination({})
      setResults({})
    }

    return () => map.remove();
  }, [reset]);

const route = async (l: any) => {
  // const home = {
  //   longitude: -121.965880,
  //   latitude: 37.399480,
  // }

  // const test_2 = { 
  //   longitude: -121.960830,
  //   latitude: 37.350798,
  // }

  // const geojson = await getRoute(currentLocation, test)
  // const { geojson } = await getRoute(currentLocation, destination)
  // const locations = [currentLocation, test, test_2]
  let locations = []
  if (!isObjectEmpty(destination)){
    locations = [currentLocation, ...l, destination]
  } else {
    locations = [currentLocation, ...l]
  }
  console.log(locations)
  const results = await getRoute(locations)
  setResults(results)
  console.log("Steps: ", results.steps)

  if (results.geojson){
    if (map.getSource('route')) {
      map.getSource('route').setData(results.geojson);
    }
    // otherwise, we'll make a new request
    else {
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: results.geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
  }

  // add routes
  for (const location of locations){

    map.addLayer({
      id: `${location.longitude}${location.latitude}`,
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [location.longitude,location.latitude]
              }
            }
          ]
        }
      },
      paint: {
        'circle-radius': 10,
        'circle-color': '#f30'
      }
    });
  }
}
  const selectAddress = (result: any) => {
    // console.log(result.featuresp)
    // console.log(destination)
    // console.log(result)
    // console.log(Object.keys(result))
    // console.log(result.features[0])

    const longitude = result.features[0].geometry.coordinates[0];
    const latitude = result.features[0].geometry.coordinates[1];

    console.log(longitude, latitude);

    setDestination({
      longitude: longitude,
      latitude: latitude,
    });

    route([]);

  };

  useEffect(() => {
    if (!isObjectEmpty(destination)) {
      route([]);
    }
  }, [destination]);
  
  

  return (
    <MapContext.Provider value={{route, currentLocation, sessionID, setIsListening, reset, setReset}}>
      <div className='flex flex-col w-1/2 h-full'>
        <div className="flex bg-[#0A0A0A]">
          <div className="flex-1 p-4">
            <SearchBox accessToken={MAPBOX_ACCESS_TOKEN} onRetrieve={selectAddress} value={'Enter an address:'}></SearchBox>
          </div>
          {isListening && (
              <div className="flex items-center justify-center p-4">
                <div className="w-8 h-8 border border-red-500 rounded-full flex items-center justify-center">
                  {/* Inner Circle */}
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                </div>
            </div>
          )}
         
        </div>
        {!isObjectEmpty(results) && results.steps.length > 0 && (<StepsNavigator steps={results.steps}></StepsNavigator>)}
        <div ref={mapContainerRef} className="h-full"/>
        {/* <button className='w-10 h-10 bg-black text-white rounded-md' onClick={() => {route([])}}>Test</button> */}
        {!isObjectEmpty(results) && <InfoNavigator duration={results.duration} distance={results.distance}/>}

        <div>
          <SpeechToText/>
        </div>
      </div>

      {/* <div>
        <WebsocketListener/>
      </div> */}
    </MapContext.Provider>
  );
};

export default Map;
