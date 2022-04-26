import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from "react-native";

import { http } from '../../../services'
import dayjs from "dayjs";
import Feather from "react-native-vector-icons/Feather";
import { store } from "../../../redux/store";

class BeatLikes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: {
        likesModal: false,
      },
    };
    this.renderLike = this.renderLike.bind(this);
    this.showLikesModal = this.showLikesModal.bind(this)
    this.closeLikesModal = this.closeLikesModal.bind(this)
    this.like = this.like.bind(this)
    this.likeUnLike = this.likeUnLike.bind(this)
  }

  showLikesModal () {
    this.setState({ ...this.state, show: { ...this.state.show, likesModal: true  } })
  }
  closeLikesModal () {
    this.setState({ ...this.state, show: { ...this.state.show, likesModal: false  } })
  }

  get currentUser () {
    return store.getState().currentUser
  }

  get userHasLiked () {
    return this.props.item.likes.map(like => like.user.id).includes(this.currentUser.id)
  }

  likeUnLike () {
    this.userHasLiked ? this.unLike() : this.like()
  }

  like () {
    // do not allow current user to like their own beat: Maybe should be on DB level
    if (this.currentUser.id !== this.props.item.user.id) {
      let data = {
        user: this.currentUser.id,
        beat: this.props.item.id
      }
      http.post('common/api/like_detail',  data).then(
        response => {
          this.fetchLikes()
        }
      ).catch(
        error => {
          console.log(error)
        }
      )

    }
  }

  unLike() {
    // get Like id of current user Like
    let like = this.props.item.likes.find(like => like.user.id === this.currentUser.id)
    let params = {
      id: like.id
    }
    http.delete('common/api/like_detail', {params: params}).then(
      response => {
        this.fetchLikes()
      }
    ).catch(
      error => {
        console.log(error)
      }
    )
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

  renderPeopleImages() {
    let images = [];
    for (let i = 0; i < this.props.item.likes.length && i < 10; i++) {
      let person = this.props.item.likes[i];
      images.push(
        <Image
          key={i}
          source={{ uri: person.user.image_thumb }}
          style={{ width: 20, height: 20, left: -(i * 6), borderRadius: 20 / 2 }} />,
      );
    }
    return images;
  }

  renderLike (item) {
    return (
      <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{ uri: item.item.user.image_thumb }}
            style={{ width: 20, height: 20, borderRadius: 20 / 2, marginRight: 10 }} />
          <Text style={{ marginRight: 10 }}>{ item.item.user.username }</Text>

          <Feather name="heart" size={20} style={{marginRight: 10}} />
          <Text> {dayjs().to(dayjs(item.item.date_created))}</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={{
        flex: 0.5,
        flexDirection: "row",
        backgroundColor: "white",
        padding: 10,
        justifyContent: "space-between",
      }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.likeUnLike}
          >
            <Feather name="heart" size={20} color={this.userHasLiked ? 'pink' : null} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={this.likeUnLike}
          >
            <View>
              <Text>{this.props.item.likes.length} Likes</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={this.showLikesModal}
        >
          <View>
            <View style={{ flexDirection: "row", direction: "rtl" }}>
              {this.renderPeopleImages()}
            </View>
          </View>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          presentationStyle="formSheet"
          visible={this.state.show.likesModal}
          onRequestClose={this.closeLikesModal}
        >
          <Text style={{padding: 20, fontSize: 17, fontWeight: 'bold'}}>Route Likes</Text>
          <FlatList
            data={this.props.item.likes}
            renderItem={this.renderLike}
            keyExtractor={(item) => item.id + 'like'}
          />

        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create(
  {
    button: {
      paddingRight: 10,
    }
    ,
  },
);

export default BeatLikes;
