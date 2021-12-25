import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RouteListView from "./RouteListView";
import RouteDetailView from "./RouteDetailView";
import { Button, Text, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";

const Stack = createNativeStackNavigator();


function RouteNavigation({ navigation, route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RouteDetailList" component={RouteListView} options={{ title: "Recent" }} />
      <Stack.Screen name="RouteDetailView" component={RouteDetailView} options={{
        title: "Route"
      }} />
    </Stack.Navigator>
  );
}

export default RouteNavigation;
