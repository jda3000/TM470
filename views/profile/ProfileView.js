import React from 'react'
import { ActionSheetIOS, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Session from "../../sessionHandler";

export default class ProfileView extends React.Component {
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
      headerRightContainerStyle: styles.headerRight
    })
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
      <View style={styles.container}>
        <Text>YourProfile Page</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  headerRight: {
    paddingRight: 17
  }
});
