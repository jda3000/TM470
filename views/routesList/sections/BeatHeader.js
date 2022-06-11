import React from "react";

import {
  View,
  Text, Image
} from "react-native";

import Feather from "react-native-vector-icons/Feather";
import dayjs from "dayjs";

class BeatHeader extends React.Component {

  constructor(props) {
    super(props);
    this.distanceLabel = this.distanceLabel.bind(this)
  }

  distanceLabel (meters) {
    let metersRounded = Number(meters).toFixed(0)
    if (metersRounded > 100) {
      return `${metersRounded/1000} km's`
    }
    return `${metersRounded} meters`
  }

  render() {
    let user;
    if (this.props.item.user.image_thumb) {
      user = <Image source={{ uri: this.props.item.user.image_thumb }}
                    style={{ width: 40, height: 40, borderRadius: 40 / 2 }} />;
    } else {
      user = <Feather name="user" size={40} />;
    }
    return (
      <View style={{ flex: 2, backgroundColor: "white" }}>

        <View style={{ flex: 1.5, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
          <View style={{ flex: 1, padding: 15 }}>
            {user}
          </View>
          <View style={{ flex: 2 }}>
            <Text style={{ fontWeight: "bold", padding: 3 }}> {this.props.item.user.username}</Text>
            <Text style={{ padding: 3 }}> {dayjs().to(dayjs(this.props.item.dateCreated))}</Text>
          </View>

          <View style={{ flex: 2 }}>
            {
              this.props.item.private ?
                <Text style={{ padding: 3 }}>
                  <Feather name="lock" /> Private
                </Text> :
                <Text></Text>
            }
            <Text style={{ padding: 3 }}>
              <Feather name="compass" /> {this.distanceLabel(this.props.item.distance)}
            </Text>

            <Text style={{ padding: 3 }}>
              <Feather name="trash-2" /> {this.props.item.litterCollectedAmount} Bags Collected
            </Text>
          </View>
        </View>

        <View style={{ flex: 0.5, padding: 10 }}>
          <Text style={{ fontWeight: "bold", paddingLeft: 10 }}>{this.props.item.description}</Text>
        </View>

      </View>
    );
  }
}

export default BeatHeader;
