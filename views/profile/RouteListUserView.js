import React from "react";

import RouteListView from "../routesList/RouteListView";

export default class RouteListUserView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "beats/api/beat_list_user",
    };
  }

  render() {
    return (
        <RouteListView
          url={this.state.url}
          navigation={this.props.navigation} />
    );
  }
}


