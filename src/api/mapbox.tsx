import { MAPBOX_ACCESS_TOKEN, MAPBOX_API_BASE_URL } from "@/constants";

export async function getRoute(start: any, end: any, profile: string = 'driving-traffic', geometries: string = 'geojson') {
  const apiUrl = `${MAPBOX_API_BASE_URL}/directions/v5/mapbox/${profile}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?steps=true&geometries=${geometries}&access_token=${MAPBOX_ACCESS_TOKEN}`

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch directions');
    }

    const json = await response.json(); // response 
    console.log("json: ", json)
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
          coordinates: route
      }
    };

    const result = {
      geojson: geojson,
      distance: data.distance,
      duration: data.duration, // seconds
      steps: data.legs[0].steps // steps
    }
    console.log(result)

    return result
  } catch (error: any) {
    console.error('Error fetching directions:', error.message);
    throw error;
  }
}