import React from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import MapView, { Polyline } from "react-native-maps";
import axios from "axios";
import convertBeat from "./helpers";

class RouteListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
    };
    this.renderBeat = this.renderBeat.bind(this);
    this.getData = this.getData.bind(this);
    this.getMoreData = this.getMoreData.bind(this);
    this.mapRefs = [];
  }

  componentDidMount() {
    this.getData();
  }

  getData(loadMore = false) {
    // load data from server
    // loadMore used for scroll loading
    this.setState({ ...this.state, loading: true });

    // for scroll loading exclude the first
    let excludeFirst = 0;
    if (loadMore) excludeFirst = this.state.data.length;

    axios.get("http://192.168.1.141:8000/beats/api/list", { params: { exclude_first: excludeFirst } }).then(
      response => {
        let newData = this.convertServerData(response)
        if (loadMore) {
          this.setState({ data: [...this.state.data, ...newData], loading: false });
        } else {
          this.setState({ data: newData, loading: false });
        }

      },
    ).catch(
      error => {
        console.log(error);
        this.setState({ ...this.state, loading: false });
      },
    );
  }

  convertServerData (response) {
    // converts data from server database for compatibility within app
    return response.data.map(beat => {
     return convertBeat(beat)
    });
  }

  getMoreData() {
    this.getData(true);
  }

  setMap(index, route) {
    // set the map view port to fit the coordinates
    if (this.mapRefs[index]) {
      this.mapRefs[index].fitToCoordinates(route, {
        edgePadding: {
          top: 40,
          right: 40,
          bottom: 40,
          left: 40,
        }, animated: false,
      });
    }
  }

  renderBeat({ item, index }) {
    const backgroundColor = "#6e3b6e";
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate("RouteDetailView", { id: item.id, onRefresh: this.getData })}
        style={[styles.item, backgroundColor]}
        activeOpacity={0.9}
      >

        <View style={{ flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
          <View><Text style={styles.title}>{item.description}</Text></View>
        </View>

        <MapView
          ref={(ref) => this.mapRefs[index] = ref }
          initialRegion={item.initialRegion}
          style={styles.map}
          scrollEnabled={false}
          zoomEnabled={false}
          onLayout={() => this.setMap(index, item.route)}
        >
          <Polyline
            coordinates={
              item.route
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

        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
          <View><Text>COMMENTS</Text></View>
          <View><Text>SHARE</Text></View>
          <View><Text>LIKE</Text></View>
        </View>

      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.con}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderBeat}
          keyExtractor={(item, index) => `${item.id}${index}`}
          refreshing={this.state.loading}
          onRefresh={this.getData}
          onEndReached={this.getMoreData}
          onEndReachedThreshold={0.8}
        />
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
});

export default RouteListView;
