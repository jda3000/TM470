import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RouteDetailView from "../routesList/RouteDetailView";
import ProfileTopNavigation from "./ProfileTopNavigation";

const Stack = createNativeStackNavigator();

export default function ProfileMainNavigation({ navigation, route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileTopNavigation" component={ProfileTopNavigation} options={{ title: "You", headerShown: true }} />
      <Stack.Screen name="RouteDetailView" component={RouteDetailView} options={{ title: "Route", headerShown: true }} />
    </Stack.Navigator>
  );
}
