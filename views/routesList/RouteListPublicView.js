import React from "react";

import RouteListView from "./RouteListView";
import { StyleSheet } from "react-native";

export default class RouteListPublicView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "beats/api/beat_following_list",
    };
  }

  render() {
    return (
      <RouteListView
        style={styles.con}
        url={this.state.url}
        navigation={this.props.navigation} />
    );
  }
}

const styles = StyleSheet.create({
  con: {
    ...StyleSheet.absoluteFillObject,
  }
})

