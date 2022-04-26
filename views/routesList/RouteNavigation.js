import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RouteListView from "./RouteListView";
import RouteDetailView from "./RouteDetailView";


const Stack = createNativeStackNavigator();


function RouteNavigation({ navigation, route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RouteDetailList" component={RouteListView} options={{ title: "Home" }} />
      <Stack.Screen name="RouteDetailView" component={RouteDetailView} options={{ title: "Route" }} />
    </Stack.Navigator>
  );
}

export default RouteNavigation;
