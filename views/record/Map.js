import React from 'react'

import MapView, { Polyline } from 'react-native-maps'

import RNLocation from 'react-native-location';

RNLocation.configure({
  desiredAccuracy: {
    ios: 'best'
  },
  allowsBackgroundLocationUpdates: true,
  showsBackgroundLocationIndicator: true,
  distanceFilter: 5.0
}
)

import {
  StyleSheet,
  View,
} from 'react-native';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {},
      locationSubscription: null
    }
    this.getLocation = this.getLocation.bind(this)
    this.updateLocations = this.updateLocations.bind(this)
    this.startTracking = this.startTracking.bind(this)
    this.resumeTracking = this.resumeTracking.bind(this)
    this.stopTracking = this.stopTracking.bind(this)
    this.setRegion = this.setRegion.bind(this)
  }

  componentDidMount() {
    this.getLocation()
  }

  async getLocation() {
    let permission = RNLocation.checkPermission({
      ios: 'always', // or 'always'
      android: {
        detail: 'fine' // or 'fine'
      }
    })

    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: "always"
      })
    }

    let location = await RNLocation.getLatestLocation({ timeout: 100 })

    this.setState({
      ...this.state,
      region: {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    })
  }

  updateLocations(location) {
    let loc = location.map(l => {
      return {
        longitude: l.longitude,
        latitude: l.latitude
      }
    })
    this.props.onLocationChange([...this.props.locations, ...loc])

  }

  async startTracking(start) {
    let sub = await RNLocation.subscribeToLocationUpdates(this.updateLocations)
    this.setState({ ...this.state, locationSubscription: sub })
  }

  resumeTracking() {
    this.startTracking()
  }

  stopTracking() {
    if (this.state.locationSubscription) {
      this.state.locationSubscription() // close subscription to location
      this.setState({ ...this.state, showModal: true })
    }
  }

  setRegion(data) {
    console.log('set region', data)
  }


  render() {
    let coordinates = this.props.locations
    return (
      <View style={ styles.container }>
        <MapView
          style={ styles.map }
          initialRegion={ this.state.region && this.state.region.latitude ? this.state.region : null }
          showsUserLocation={ true }
          followsUserLocation={ true }
          showsMyLocationButton={ true }
        >
          <Polyline
            coordinates={
              coordinates
            }
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={ [
              '#7F0000',
              '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
              '#B24112',
              '#E5845C',
              '#238C23',
              '#7F0000'
            ] }
            strokeWidth={ 6 }
          />

        </MapView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 11,
    // ...StyleSheet.absoluteFillObject,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  timer: {
    flex: 1
  }
});
