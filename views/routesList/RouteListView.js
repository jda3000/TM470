import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import BeatHeader from './sections/BeatHeader'

import MapView, { Polyline } from "react-native-maps";
import { http } from "../../services";
import convertBeat from "./helpers";
import BeatFooterList from "./sections/BeatFooterList";

class RouteListView extends React.Component {
  constructor(props) {
    super(props);
    this.mapRefs = [];
    this.state = {
      loading: false,
      data: [],
    };
    this.getData = this.getData.bind(this);
    this.renderBeat = this.renderBeat.bind(this);
    this.getMoreData = this.getMoreData.bind(this);
    this.setLikes = this.setLikes.bind(this)
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

    http.get(this.props.url, { params: { exclude_first: excludeFirst } }).then(
      response => {
        let newData = this.convertServerData(response);
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

  convertServerData(response) {
    // converts data from server database for compatibility within app
    return response.data.map(beat => {
      return convertBeat(beat);
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

    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate("RouteDetailView", { id: item.id, onRefresh: this.getData })}
        style={styles.item}
        activeOpacity={0.9}
      >
        <BeatHeader item={item} />

        <MapView
          ref={(ref) => this.mapRefs[index] = ref}
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
            strokeColors={[
             item.strokeColour
            ]}
            strokeWidth={6}
          />
        </MapView>

        <BeatFooterList item={item} onLikesChange={(data) => this.setLikes(data, item, index)} />

      </TouchableOpacity>
    );
  }

  setLikes (data, item, index) {
    // sets like's on beat detail (after adding a new like)
    const newData = [...this.state.data]
    newData[index].likes = data
    this.setState({...this.state, data: newData})
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderBeat}
          keyExtractor={(item, index) => `${item.id}beat${index}`}
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
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1
  },
  map: {
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

export default RouteListView;
