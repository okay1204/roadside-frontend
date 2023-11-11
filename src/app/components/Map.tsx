'use client'
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoicmstc2N1IiwiYSI6ImNsb3VqenEycTBjZnYyamxzZW03YXNwN3kifQ.8F1qz8MDLwT6Fnt3CmLQzQ';

const Map = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 1.5,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    map.addControl(geolocate);

    map.on('load', () => {
      geolocate.trigger();
    });

    interface GeolocationPosition {
        coords: {
          latitude: number;
          longitude: number;
        };
      }

    geolocate.on('geolocate', (e) => {
        const position = e as GeolocationPosition;
        map.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            essential: true,
            zoom: 10,
        });
    });
      
      

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;