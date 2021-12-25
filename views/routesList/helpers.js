export default function convertBeat(rawBeat) {
  // converts a single beat object from server to app compatible version
  let coordinates = rawBeat.route.coordinates.map(point => {
    return {
      longitude: point[0],
      latitude: point[1]
    }
  }).flat()
  let centerCoordinateIndex = Number((coordinates.length / 2).toFixed(0))

  return {
    id: rawBeat.id,
    description: rawBeat.description,
    route: coordinates,
    initialRegion: {
      latitude: coordinates[centerCoordinateIndex].latitude,
      longitude: coordinates[centerCoordinateIndex].longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.04
    }
  }
}

