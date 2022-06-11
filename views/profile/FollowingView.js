import React from "react";

import { ActionSheetIOS, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { http } from "../../services";
import Feather from "react-native-vector-icons/Feather";
import dayjs from "dayjs";

export default class FollowingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.fetch = this.fetch.bind(this);
    this.renderFollowing = this.renderFollowing.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    http.get("common/api/following_list").then(
      response => {
        this.setState({ ...this.state, data: response.data });
      },
    ).catch(
      error => {
        console.log(error);
      },
    );
  }

  renderFollowing(item) {
    return (
      <View style={{ flex: 2, flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: item.item.recipient.image_thumb }}
            style={{ width: 20, height: 20, borderRadius: 20 / 2, marginRight: 10 }} />

            <Text style={{ marginRight: 10 }}>{item.item.recipient.username}</Text>
        </View>
      </View>
    );

  }

  render() {
    return (
      <View style={styles.container}>
          <FlatList
            data={this.state.data}
            renderItem={this.renderFollowing}
            keyExtractor={(item) => item.id + "following"}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white'
  }
}
)
