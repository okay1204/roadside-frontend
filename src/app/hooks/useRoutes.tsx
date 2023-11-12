// import { useState, useEffect } from 'react';

// const useRoutes = () => {
//   const [currentLocation, setCurrentLocation] = useState({});
//   const [startLocation, setStartLocation] = useState(null);
//   const [destinationLocation, setDestinationLocation] = useState(null);

//   useEffect(() => {
//     // Fetch user's current location using geolocation API
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCurrentLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       },
//       (error) => {
//         console.error('Error getting current location:', error);
//       }
//     );
//   }, []); // Run once on component mount

//   // Function to set the starting location
//   const setStart = (latitude, longitude) => {
//     setStartLocation({ latitude, longitude });
//   };

//   // Function to set the destination location
//   const setDestination = (latitude, longitude) => {
//     setDestinationLocation({ latitude, longitude });
//   };

//   // Function to clear starting and destination locations
//   const clearLocations = () => {
//     setStartLocation(null);
//     setDestinationLocation(null);
//   };

//   return {
//     currentLocation,
//     startLocation,
//     destinationLocation,
//     setStart,
//     setDestination,
//     clearLocations,
//   };
// };

// export default useRoutes;
