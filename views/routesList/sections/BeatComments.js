import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image, TextInput,
} from "react-native";

import { http } from "../../../services";
import dayjs from "dayjs";
import Feather from "react-native-vector-icons/Feather";

class BeatComments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: {
        commentsModal: false,
      },
      form: {
        beat: null,
        post: null,
      },
      errors: {},
    };
    this.onChangeText = this.onChangeText.bind(this);
    this.renderComment = this.renderComment.bind(this);
    this.showCommentsModal = this.showCommentsModal.bind(this);
    this.closeCommentsModal = this.closeCommentsModal.bind(this);
    this.saveComment = this.saveComment.bind(this);
  }

  showCommentsModal() {
    this.setState({ ...this.state, show: { ...this.state.show, commentsModal: true } });
  }

  closeCommentsModal() {
    this.setState({ ...this.state, show: { ...this.state.show, commentsModal: false } });
  }

  onChangeText(value) {
    this.setState({ ...this.state, form: { ...this.state.form, post: value } });
  }

  saveComment() {
    this.clearErrors();
    // saves a new comment
    let data = Object.assign(this.state.form);
    // add beat id reference
    data.beat = this.props.item.id;
    // save
    http.post("common/api/comment_detail", data).then(
      response => {
        this.fetchComments();
        this.clearForm();
      },
    ).catch(
      error => {
        this.handleErrors(error.response.data);
      },
    );
  }

  clearForm() {
    this.setState({ ...this.state, form: { beat: null, post: null } });
  }

  fetchComments() {
    let params = {
      beat: this.props.item.id,
    };
    http.get("common/api/comment_list", { params: params }).then(
      response => {
        this.props.onCommentsChange(response.data);
      },
    ).catch(
      error => {
        console.log(error);
      },
    );
  }

  clearErrors() {
    this.setState({ ...this.state, errors: {} });
  }

  handleErrors(errors) {
    console.log(errors);
    let keys = Object.keys(errors);
    for (let i = 0; i < keys.length; i++) {
      this.setState({ ...this.state, errors: { ...errors, [keys[i]]: errors[keys[i]] } });
    }
  }

  renderPeopleImages() {
    let images = [];
    for (let i = 0; i < this.props.item.comments.length && i < 10; i++) {
      let person = this.props.item.comments[i];
      images.push(
        <Image
          key={i}
          source={{ uri: person.user.image_thumb }}
          style={{ width: 20, height: 20, left: -(i * 6), borderRadius: 20 / 2 }} />,
      );
    }
    return images;
  }

  renderComment(item) {
    return (
      <View style={{ flex: 2, padding: 10 }}>

        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          <Feather name="message-square" size={20} style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 16 }}>{item.item.post}</Text>
        </View>

        <View style={{ flexDirection: "row", fontSize: 8, justifyContent: "flex-end" }}>
          <Image
            source={{ uri: item.item.user.image_thumb }}
            style={{ width: 14, height: 14, borderRadius: 14 / 2, marginRight: 10 }} />
          <Text style={{ marginRight: 10 }}>{item.item.user.username}</Text>

          <Text> {dayjs().to(dayjs(item.item.date_created))}</Text>
        </View>

      </View>
    );
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
            onPress={() => this.showCommentsModal()}
          >
            <Feather name="message-square" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.showCommentsModal()}
          >
            <View>
              <Text>{this.props.item.comments.length} Comments</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={this.showCommentsModal}
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
          visible={this.state.show.commentsModal}
          onRequestClose={this.closeCommentsModal}

        >
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.5 }}>
              <Text style={{ padding: 20, fontSize: 17, fontWeight: "bold" }}>Route Comments</Text>
            </View>

            <View style={{ flex: 5 }}>
              <FlatList
                data={this.props.item.comments}
                renderItem={this.renderComment}
                keyExtractor={(item) => item.id + "comment"}
              />
            </View>


            <View style={{ flex: 1 }}>

              <View style={{ padding: 10 }}>
                <Text>{this.state.errors?.post}</Text>
              </View>

              <View style={{ flex: 1, flexDirection: "row", padding: 10 }}>
                <View style={{ flex: 1, borderStyle: "solid", marginRight: 20 }}>
                  <TextInput
                    style={{ borderStyle: "solid", borderWidth: 1, padding: 10 }}
                    onChangeText={this.onChangeText}
                    value={this.state.form.post}
                    multiline={true}
                  />
                </View>

                <TouchableOpacity
                  onPress={this.saveComment}
                >
                  <Feather name="save" size={20} />
                </TouchableOpacity>

              </View>


            </View>

          </View>

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

export default BeatComments;
