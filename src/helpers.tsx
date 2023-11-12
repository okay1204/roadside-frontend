export const isObjectEmpty = (obj: any) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export const coordinatesString = (locations: any) => {
    return locations.map((location: any) => `${location.longitude},${location.latitude}`).join(';');
}
  