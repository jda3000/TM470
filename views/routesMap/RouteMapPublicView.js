import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import {
  View,
  StyleSheet, Text,
} from "react-native";


import MapView, { Polyline, Marker, Callout } from "react-native-maps";
import { http } from "../../services";

import convertBeat from "../routesList/helpers";
import RNLocation from "react-native-location";
import BeatHeader from "../routesList/sections/BeatHeader";

RNLocation.configure({
    desiredAccuracy: {
      ios: "best",
    },
    allowsBackgroundLocationUpdates: true,
    showsBackgroundLocationIndicator: true,
    distanceFilter: 5.0,
  },
);


class RouteMapPublicView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      location: {},
    };
    this.getData = this.getData.bind(this);
    this.setRegion = this.setRegion.bind(this);
    this.setInitialLocation = this.setInitialLocation.bind(this);
    this.setChangedLocation = this.setChangedLocation.bind(this)
  }

  async componentDidMount() {
    await this.setInitialLocation();
    this.getData();
  }

  async setInitialLocation() {
    let permission = RNLocation.checkPermission({
      ios: "always", // or 'always'
      android: {
        detail: "fine", // or 'fine'
      },
    });

    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: "always",
      });
    }

    let location = await RNLocation.getLatestLocation({ timeout: 100 });

    this.setState({
      ...this.state,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
    });
  }
  async setChangedLocation(region) {
    this.setState({
      ...this.state,
      location: {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      },
    });

    return true
  }
  getData() {
    // load data from server based upon current location

    this.setState({ ...this.state, loading: true });

    let params = {
      coordinates: {
        type: "Point",
        coordinates: [this.state.location.longitude, this.state.location.latitude, ]
      },
      latitude_delta: this.state.location.latitudeDelta,
      longitude_delta: this.state.location.longitudeDelta
    };

    http.get("beats/api/beat_map", { params: params }).then(
      response => {
        let newData = this.convertServerData(response);
        this.setState({ data: newData, loading: false });
      },
    ).catch(
      error => {
        console.log(error);
        this.setState({ ...this.state, loading: false });
      },
    );
  }

  convertServerData(response) {
    // converts data from server database for compatibility within app
    return response.data.map(beat => {
      return convertBeat(beat);
    });
  }

  async setRegion(region) {
    await this.setChangedLocation(region)
    this.getData();
  }

  render() {
    let polygons = this.state.data.map(item => {
      return (
        <Polyline
          key={item.id+'polygon'}
          coordinates={
            item.route
          }
          strokeColors={[
            item.strokeColour,
          ]}
          strokeWidth={6}
          tappable={true}
          onPress={() => this.props.navigation.navigate("RouteDetailView", { id: item.id, onRefresh: this.getData })}
        />
      );
    });

    let markers = this.state.data.map(item => {
      return (
        <Marker
          key={item.id+'marker'}
          title={'Marker title here'}
          description={'Marker description here'}
          coordinate={item.startLocation}
          pinColor={item.strokeColour}
          onCalloutPress={() => this.props.navigation.navigate("RouteDetailView", { id: item.id, onRefresh: this.getData })}
        >
          <Callout>
            <BeatHeader item={item} />
          </Callout>
        </Marker>
      )
    })

    return (
      <View style={styles.con}>
        <MapView
          initialRegion={this.state.location && this.state.location.latitude ? this.state.location : null}
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={false}
          showsMyLocationButton={true}
          onRegionChangeComplete={(region) => this.setRegion(region)}
        >
          {polygons}
          {markers}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  con: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    // ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    flex: 4,
  },


  item: {
    height: 400,
    padding: 0,
    borderColor: "black",
    marginVertical: 30,
    marginHorizontal: 0,
    marginTop: 0,
    backgroundColor: "white",
  },
  title: {
    fontSize: 15,
  },
  button: {
    padding: 10,
  },
});

export default RouteMapPublicView;
