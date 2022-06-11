function distance(coordsOne, coordsTwo) {
  // returns distance between coordinates in meters taking into consideration the earth curvature
  // taken from https://www.movable-type.co.uk/scripts/latlong.html

  const R = 6371e3; // metres
  const φ1 = coordsOne.latitude * Math.PI / 180; // φ, λ in radians
  const φ2 = coordsTwo.latitude * Math.PI / 180;
  const Δφ = (coordsTwo.latitude - coordsOne.latitude) * Math.PI / 180;
  const Δλ = (coordsTwo.longitude - coordsOne.longitude) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}


export default function convertBeat(rawBeat) {
  // converts a single beat object from server to app compatible version
  let coordinates = rawBeat.route.coordinates.map(point => {
    return {
      longitude: point[0],
      latitude: point[1],
    };
  }).flat();

  let startLocation = {
    longitude: rawBeat.start_point.coordinates[0],
    latitude: rawBeat.start_point.coordinates[1],
  }


  // calculate distance covered
  let totalDistance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    totalDistance += distance(coordinates[i - 1], coordinates[i]);
  }

  // colour of route; based upon amount of litter collected
  let litterCollected = rawBeat.litter_collected_amount ? rawBeat.litter_collected_amount : 0;
  let bagsPer100Meters = (litterCollected / totalDistance) * 100
  let strokeColour = "#7F0000";
  if (bagsPer100Meters > 1) strokeColour = "#7F0000";
  else if (bagsPer100Meters > 0.7 && bagsPer100Meters <= 1) strokeColour = "#E5845C";
  else if (bagsPer100Meters > 0.4 && bagsPer100Meters <= 0.7) strokeColour = "#E1C16E";
  else if (bagsPer100Meters <= 0.4) strokeColour = "#238C23";

  let centerCoordinateIndex = Number((coordinates.length / 2).toFixed(0));
  return {
    id: rawBeat.id,
    description: rawBeat.description,
    route: coordinates,
    initialRegion: {
      latitude: coordinates[centerCoordinateIndex].latitude,
      longitude: coordinates[centerCoordinateIndex].longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.04,
    },
    startTime: rawBeat.start_time,
    endTime: rawBeat.end_time,
    comments: rawBeat.comments,
    likes: rawBeat.likes,
    files: rawBeat.files,
    user: rawBeat.user,
    dateCreated: rawBeat.date_created,
    litterCollectedAmount: litterCollected,
    private: rawBeat.private,
    strokeColour: strokeColour,
    distance: totalDistance, // meters
    startLocation: startLocation,
    following: rawBeat.following
  };


}

