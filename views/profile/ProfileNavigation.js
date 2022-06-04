import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RouteListUserView from "./RouteListUserView";
import RouteDetailView from "../routesList/RouteDetailView";

const Stack = createNativeStackNavigator();

export default function ProfileNavigation({ navigation, route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RouteUserList" component={RouteListUserView} options={{ title: "Your Routes" }} />
      <Stack.Screen name="RouteDetailView" component={RouteDetailView} options={{ title: "Route" }} />
    </Stack.Navigator>
  );
}
