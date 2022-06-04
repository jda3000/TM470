import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Feather from "react-native-vector-icons/Feather";
import { store } from "../../../redux/store";
import { http } from "../../../services";

class BeatFooterList extends React.Component {
  constructor(props) {
    super(props);
    this.like = this.like.bind(this);
    this.likeUnLike = this.likeUnLike.bind(this);
  }

  get currentUser() {
    return store.getState().currentUser;
  }

  get userHasLiked() {
    if (store.getState().currentUser) {
      return this.props.item.likes.map(like => like.user.id).includes(this.currentUser.id);
    }
    return null
  }

  likeUnLike() {
    this.userHasLiked ? this.unLike() : this.like();
  }

  like() {
    // do not allow current user to like their own beat: Maybe should be on DB level
    if (this.currentUser.id !== this.props.item.user.id) {
      let data = {
        user: this.currentUser.id,
        beat: this.props.item.id,
      };
      http.post("common/api/like_detail", data).then(
        response => {
          this.fetchLikes();
        },
      ).catch(
        error => {
          console.log(error);
        },
      );

    }
  }

  unLike() {
    // get Like id of current user Like
    let like = this.props.item.likes.find(like => like.user.id === this.currentUser.id);
    let params = {
      id: like.id,
    };
    http.delete("common/api/like_detail", { params: params }).then(
      response => {
        this.fetchLikes();
      },
    ).catch(
      error => {
        console.log(error);
      },
    );
  }

  fetchLikes() {
    let params = {
      beat: this.props.item.id,
    };
    http.get("common/api/like_list", { params: params }).then(
      response => {
        this.props.onLikesChange(response.data);
      },
    ).catch(
      error => {
        console.log(error);
      },
    );
  }

  render() {
    return (
      <View style={{ flex: 0.7, flexDirection: "row", padding: 10, justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 12 }}>
            {this.props.item.likes.length} Likes {this.props.item.comments.length} Comments
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.likeUnLike}
          >
            <Feather name="heart" size={20} color={this.userHasLiked ? 'pink' : null} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
});

export default BeatFooterList;
