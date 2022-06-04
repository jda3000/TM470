/**
 * TM470
 * https://github.com/jda3000/TM470.git
 *
 * @format
 * @flow strict-local
 */

import React from "react";

import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Feather from "react-native-vector-icons/Feather";
import Session from "./sessionHandler";

import RouteListNavigation from "./views/routesList/RouteListNavigation";
import ProfileNavigation from "./views/profile/ProfileNavigation";
import RouteMapNavigation from "./views/routesMap/RouteMapNavigation";

import RecordView from "./views/record/RecordView";

import Login from "./views/sessions/Login";
import Register from "./views/sessions/Register";
import ForgottenPassword from "./views/sessions/ForgottenPassword";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import { store, persistedStore } from "./redux/store";

function AppNavigation({ navigation, route }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={RouteListNavigation}
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }} />
      <Tab.Screen
        name="Nearby"
        component={RouteMapNavigation}
        options={{
          tabBarLabel: "Nearby",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" color={color} size={size} />
          ),
        }} />
      <Tab.Screen
        name="Record"
        component={RecordView}
        options={{
          tabBarLabel: "Record",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="circle" color={color} size={size} />
          ),
        }} />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigation}
        options={{
          tabBarLabel: "You",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }} />
    </Tab.Navigator>
  );

}

function SessionNavigation({ navigation, route }) {
  return (
    <Stack.Navigator >
      <Stack.Screen name={'Login'}  component={Login} />
      <Stack.Screen name={'Register'} component={Register} />
      <Stack.Screen name={'ForgottenPassword'} component={ForgottenPassword} />
    </Stack.Navigator>
  )
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    }

    const unsubscribeFromStore = store.subscribe(() => {
      this.setState({isAuthenticated: store.getState().isAuthenticated})
    })
  }

  componentDidMount() {
    Session._inspectToken()
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={true} persistor={persistedStore}>
        <NavigationContainer>
          {this.state.isAuthenticated ? <AppNavigation /> : <SessionNavigation />}
        </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
}

export default App
