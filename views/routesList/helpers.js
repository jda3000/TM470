export default function convertBeat(rawBeat) {
  // converts a single beat object from server to app compatible version
  let coordinates = rawBeat.route.coordinates.map(point => {
    return {
      longitude: point[0],
      latitude: point[1]
    }
  }).flat()

  let centerCoordinateIndex = Number((coordinates.length / 2).toFixed(0))
  console.log('date created', rawBeat.date_created)
  return {
    id: rawBeat.id,
    description: rawBeat.description,
    route: coordinates,
    initialRegion: {
      latitude: coordinates[centerCoordinateIndex].latitude,
      longitude: coordinates[centerCoordinateIndex].longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.04
    },
    startTime: rawBeat.start_time,
    endTime: rawBeat.end_time,
    comments: rawBeat.comments,
    likes: rawBeat.likes,
    files: rawBeat.files,
    user: rawBeat.user,
    dateCreated: rawBeat.date_created,
    litterCollectedAmount: rawBeat.litter_collected_amount ? rawBeat.litter_collected_amount : 0
  }



}

