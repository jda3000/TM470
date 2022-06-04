import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RouteListPublicView from "./RouteMapPublicView";
import RouteDetailView from "../routesList/RouteDetailView";


const Stack = createNativeStackNavigator();

export default function RouteMapNavigation({ navigation, route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RouteDetailList" component={RouteListPublicView} options={{ title: "Nearby" }} />
      <Stack.Screen name="RouteDetailView" component={RouteDetailView} options={{ title: "Route" }} />
    </Stack.Navigator>
  );
}
