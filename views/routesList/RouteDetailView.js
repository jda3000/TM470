import React from "react";
import convertBeat from "./helpers";




import {
  View,
  StyleSheet, TouchableOpacity, ActionSheetIOS, Alert, LogBox
} from "react-native";
import MapView, { Polyline } from "react-native-maps";

import axios from "axios";
import Feather from "react-native-vector-icons/Feather";

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);


class RouteDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
    this.id = props.route.params.id;
    this.fetchDetail = this.fetchDetail.bind(this);
    this.map = React.createRef();
    this.showMenu = this.showMenu.bind(this);
    this.deleteDetail = this.deleteDetail.bind(this);
  }

  componentDidMount() {
    this.fetchDetail();
    this.props.navigation.setOptions({
      headerRight: (color, size) => (
        <TouchableOpacity onPress={this.showMenu}>
          <Feather name="more-horizontal" color={color} size={25} />
        </TouchableOpacity>
      ),
    })
  }

  showMenu() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Delete Activity"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          Alert.alert(
            "Delete",
            "Are you sure you want to delete this activity?",
            [
              {
                text: "Cancel",
                onPress: null,
                style: "cancel",
              },
              { text: "OK", onPress: this.deleteDetail },
            ],
          );
        }
      },
    );
  }

  deleteDetail() {
    axios.delete("http://192.168.1.141:8000/beats/api/beat_detail", { params: { id: this.state.data.id } }).then(
      response => {
        this.props.navigation.goBack()
        this.props.route.params.onRefresh()
      },
    ).catch(
      error => {
        console.log(error);
      },
    );
  }

  fetchDetail() {
    // load detail data from server
    axios.get("http://192.168.1.141:8000/beats/api/beat_detail", { params: { id: this.props.route.params.id } }).then(
      response => {
        this.setState({ data: convertBeat(response.data) });
        this.setMap();
      },
    ).catch(
      error => {
        console.log(error.response.data);
      },
    );
  }

  setMap() {
    // set the map view port to fit the coordinates
    if (this.map.current && this.state.data) {
      this.map.current.fitToCoordinates(this.state.data.route, {
        edgePadding: {
          top: 40,
          right: 40,
          bottom: 40,
          left: 40,
        }, animated: false,
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={this.map}
          initialRegion={this.state.data ? this.state.data.initialRegion : null}
          style={styles.map}
        >
          <Polyline
            coordinates={
              this.state.data ? this.state.data.route : null
            }
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={[
              "#7F0000",
              "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
              "#B24112",
              "#E5845C",
              "#238C23",
              "#7F0000",
            ]}
            strokeWidth={6}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});


export default RouteDetailView;
