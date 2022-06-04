import React from "react";
import RouteListView from "./RouteListView";

export default class RouteListPublicView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "beats/api/beat_list",
    };
  }

  render() {
    return (
      <RouteListView url={this.state.url} navigation={this.props.navigation} />
    );
  }
}

