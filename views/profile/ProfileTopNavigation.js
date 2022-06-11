import React from "react";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ActionSheetIOS, Alert, StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";

import Feather from "react-native-vector-icons/Feather";
import Session from "../../sessionHandler";
import RouteListUserView from "./RouteListUserView";
import FollowingView from "./FollowingView";

const Tab = createMaterialTopTabNavigator();

export default class ProfileTopNavigation extends React.Component {
  constructor(props) {
    super(props);
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

  render () {
    return (
      <Tab.Navigator
        initialRouteName="ProfileRecentView">
          <Tab.Screen name="ProfileRecentView" component={RouteListUserView} options={{ tabBarLabel: "Recent" }} />
        <Tab.Screen name="ProfileFollowingView" component={FollowingView} options={{ tabBarLabel: "Following" }} />
      </Tab.Navigator>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1
  },
  headerRight: {
    paddingRight: 17,
  },
});
