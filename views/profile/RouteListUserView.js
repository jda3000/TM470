import React from "react";
import RouteListView from "../routesList/RouteListView";
import { ActionSheetIOS, Alert, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Session from "../../sessionHandler";

export default class RouteListUserView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "beats/api/beat_list_user",
    };

    this.showMenu = this.showMenu.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: (color, size) => (
        <TouchableOpacity onPress={this.showMenu}>
          <Feather name="more-horizontal" color={color} size={25} />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: styles.headerRight,
    });
  }

  showMenu() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Logout"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          Alert.alert(
            "Confirm",
            "Are you sure you want to logout?",
            [
              {
                text: "Cancel",
                onPress: null,
                style: "cancel",
              },
              { text: "OK", onPress: Session.logout },
            ],
          );
        }
      },
    );
  }

  render() {
    return (
      <RouteListView
        url={this.state.url}
        navigation={this.props.navigation} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  headerRight: {
    paddingRight: 17,
  },
});
