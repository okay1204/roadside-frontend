"use client";
import React, { useEffect, useRef, useState, createContext } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_ACCESS_TOKEN } from "@/constants";
import { getRoute } from "@/api/mapbox";
import { SearchBox } from "@mapbox/search-js-react";
import { isObjectEmpty } from "@/helpers";
import Hazard from "./Hazard";
// const MapboxTraffic = require("@mapbox/mapbox-gl-traffic");

export const MapContext = createContext({});

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const Map = () => {
  const [map, setMap] = useState<any>();
  const [currentLocation, setCurrentLocation] = useState<any>({});
  const [destination, setDestination] = useState<any>({});

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
      // map.addControl(new MapboxTraffic());
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

    return () => map.remove();
  }, []);

const route = async () => {
  const test = {
    longitude: -121.965880,
    latitude: 37.399480,
  }

  const test_2 = { 
    longitude: -121.960830,
    latitude: 37.350798,
  }

  // const geojson = await getRoute(currentLocation, test)
  // const { geojson } = await getRoute(currentLocation, destination)
  const locations = [currentLocation, test, test_2]
  const { geojson } = await getRoute(locations)

  if (geojson){
    if (map.getSource('route')) {
      map.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
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
  let index = 0
  for (const location of locations){
    index = index + 1 

    map.addLayer({
      id: `stop_${index}`,
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
  };

  useEffect(() => {
    if (!isObjectEmpty(destination)) {
      // console.log("Destination: ", destination)
      route();
    }
    // route()
  }, [destination]);
  
  

  return (
    <MapContext.Provider value={{map, setMap}}>
      <div className='w-1/2 h-full'>
        <SearchBox accessToken={MAPBOX_ACCESS_TOKEN} onRetrieve={selectAddress} value={'Enter an address:'}></SearchBox>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
        <button className='w-10 h-10 bg-black text-white rounded-md' onClick={route}>Test</button>
      </div>
    </MapContext.Provider>
  );
};

export default Map;
