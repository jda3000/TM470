import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RouteListPublicView from "./RouteListPublicView";
import RouteDetailView from "./RouteDetailView";


const Stack = createNativeStackNavigator();

export default function RouteListNavigation({ navigation, route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RouteDetailList" component={RouteListPublicView} options={{ title: "Home" }} />
      <Stack.Screen name="RouteDetailView" component={RouteDetailView} options={{ title: "Route" }} />
    </Stack.Navigator>
  );
}
