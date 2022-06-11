import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ActionSheetIOS,
  Alert,
  LogBox,
} from "react-native";

import { http } from "../../services";
import convertBeat from "./helpers";
import Feather from "react-native-vector-icons/Feather";
import BeatHeader from "./sections/BeatHeader";
import BeatLikes from "./sections/BeatLikes";
import BeatMap from "./sections/BeatMap";
import BeatImages from "./sections/BeatImages";
import BeatComments from "./sections/BeatComments";
import SaveModal from "../record/SaveModal";
import { store } from "../../redux/store";


LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);


class RouteDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      showModal: false
    };
    this.id = props.route.params.id;
    this.fetchDetail = this.fetchDetail.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.deleteDetail = this.deleteDetail.bind(this);
    this.setComments = this.setComments.bind(this);
    this.setLikes = this.setLikes.bind(this);
    this.follow = this.follow.bind(this);
    this.save = this.save.bind(this)
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
    // two different menu actions based upon viewing users own routes or other peoples routes
    let currentUserBeat = this.state.data.user.id === store.getState().currentUser.id;

    if (currentUserBeat) {
      this.currentUserBeatStyleSheet();
    } else {
      this.otherUserBeatStyleSheet();
    }
  }

  currentUserBeatStyleSheet() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Delete Activity", "Edit Activity"],
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
        } else if (buttonIndex === 2) {
          console.log("edit activity");
          this.setState({...this.state, showModal: true})
        }
      },
    );
  }

  otherUserBeatStyleSheet() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", `${this.state.data.following ? "Un-Follow" : "Follow"}`],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          this.state.data.following ? this.unFollow() : this.follow();
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

  follow() {
    let data = {
      recipient: this.state.data.user.id,
    };
    http.post("common/api/following_detail", data).then(
      response => {
        console.log(response.data);
        this.fetchDetail();
      },
    ).catch(
      error => {
        console.log(error);
      },
    );
  }

  unFollow() {
    http.delete("common/api/following_detail", { params: { id: this.state.data.following.id } }).then(
      response => {
        console.log(response.data);
        this.fetchDetail();
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

  setComments(data) {
    // sets comment's on beat detail (after adding a new comment)
    this.setState({ ...this.state, data: { ...this.state.data, comments: data } });
  }

  setLikes(data) {
    // sets like's on beat detail (after adding a new like)
    this.setState({ ...this.state, data: { ...this.state.data, likes: data } });
  }

  save(form) {
    // clear form
    // clear errors
    this.setState({...this.state, errors: null})
    let data = {
      // custom description or use today's date
      id: form.id,
      description: form.description ? form.description : new Date().toUTCString(),
      litter_collected_amount: form.litter_collected_amount,
      private: form.private
    }
    http.patch('beats/api/beat_detail', data).then(
      () => {
        console.log('save successful')
        this.setState({...this.state, showModal: false})
        this.fetchDetail()
      }
    ).catch(
      error => {
        console.log('errors', error.response.data)
        // handle errors
        this.setState({ ...this.state, errors: error.response.data });
      }
    )

  }

  renderDetail() {
    return (
      <View style={{ flex: 1 }}>
        <BeatHeader item={this.state.data} />
        <BeatMap item={this.state.data} />
        <BeatLikes item={this.state.data} onLikesChange={this.setLikes} />
        <BeatComments item={this.state.data} onCommentsChange={this.setComments} />
        <BeatImages item={this.state.data} />
        <SaveModal
          data={this.state.data}
          show={this.state.showModal}
          onResume={this.resumeTimer}
          onSave={this.save} />
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
