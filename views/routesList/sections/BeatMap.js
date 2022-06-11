import React from "react";

import {
  View,
  StyleSheet,
} from "react-native";

import MapView, { Polyline } from "react-native-maps";

class BeatMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.item,
    };
    this.map = React.createRef();
  }

  componentDidMount() {
    this.setMap();
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
            strokeColors={[
              this.state.data.strokeColour,
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
    flex: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default BeatMap;
