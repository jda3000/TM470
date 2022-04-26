import React from "react";
import convertBeat from "./helpers";

import {
  View,
  Text,
  TouchableOpacity,
  ActionSheetIOS,
  Alert,
  LogBox,
} from "react-native";

import { http } from "../../services";
import Feather from "react-native-vector-icons/Feather";
import BeatHeader from "./sections/BeatHeader";
import BeatLikes from "./sections/BeatLikes";
import BeatMap from "./sections/BeatMap";
import BeatImages from "./sections/BeatImages";
import BeatComments from "./sections/BeatComments";


LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);


class RouteDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
    this.id = props.route.params.id;
    this.fetchDetail = this.fetchDetail.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.deleteDetail = this.deleteDetail.bind(this);
    this.setComments = this.setComments.bind(this)
    this.setLikes = this.setLikes.bind(this)
  }

  componentDidMount() {
    this.fetchDetail();
    this.props.navigation.setOptions({
      headerRight: (color, size) => (
        <TouchableOpacity onPress={this.showMenu}>
          <Feather name="more-horizontal" color={color} size={25} />
        </TouchableOpacity>
      ),
    });
  }

  showMenu() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Delete Activity", 'Edit Activity'],
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
        else if (buttonIndex === 2) {
          console.log('edit activity')
        }
      },
    );
  }

  deleteDetail() {
    http.delete("beats/api/beat_detail", { params: { id: this.state.data.id } }).then(
      response => {
        this.props.navigation.goBack();
        this.props.route.params.onRefresh();
      },
    ).catch(
      error => {
        console.log(error);
      },
    );
  }

  fetchDetail() {
    // load detail data from server
    http.get("beats/api/beat_detail", { params: { id: this.props.route.params.id } }).then(
      response => {
        this.setState({ data: convertBeat(response.data) });
      },
    ).catch(
      error => {
        console.log(error.response.data);
      },
    );
  }

  setComments (data) {
    // sets comment's on beat detail (after adding a new comment)
    this.setState({...this.state, data: {...this.state.data, comments: data}})
  }

  setLikes (data) {
    // sets like's on beat detail (after adding a new like)
    this.setState({...this.state, data: {...this.state.data, likes: data}})
  }

  renderDetail() {
    return (
      <View style={{ flex: 1 }}>
        <BeatHeader item={this.state.data} />
        <BeatMap item={this.state.data} />
        <BeatLikes item={this.state.data} onLikesChange={this.setLikes} />
        <BeatComments item={this.state.data} onCommentsChange={this.setComments} />
        <BeatImages item={this.state.data} />
      </View>
    );
  }

  render() {
    if (this.state.data) return this.renderDetail();
    return (
      <View>
        <Text>No Data</Text>
      </View>
    );
  }
}

export default RouteDetailView;
