import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import {
  View,
  StyleSheet,
} from "react-native";


import MapView, { Polyline } from "react-native-maps";
import { http } from "../../services";

import convertBeat from "../routesList/helpers";
import RNLocation from "react-native-location";


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
      initialRegion: null,
      location: {},
    };
    this.getData = this.getData.bind(this);
    this.setInitialLocation = this.setInitialLocation.bind(this);
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

  getData() {
    // load data from server based upon current location

    this.setState({ ...this.state, loading: true });

    let params = {
      coordinates: [],
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

  render() {
    let items = this.state.data.map(item => {
      return (
        <Polyline
          key={item.id}
          coordinates={
            item.route
          }
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={[
            item.strokeColour
          ]}
          strokeWidth={6}
          tappable={true}
          onPress={() => this.props.navigation.navigate("RouteDetailView", { id: item.id, onRefresh: this.getData })}
        />
      );
    });


    return (
      <View style={styles.con}>
        <MapView
          initialRegion={this.state.location && this.state.location.latitude ? this.state.location : null}
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={false}
          showsMyLocationButton={true}
        >

          {items}

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
