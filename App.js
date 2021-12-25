/**
 * TM470
 * https://github.com/jda3000/TM470.git
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

import RouteNavigation from './views/routesList/RouteNavigation';
import RecordView from './views/record/RecordView';
const Tab = createBottomTabNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Recent"
          component={ RouteNavigation }
          options={ {
            tabBarLabel: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" color={ color } size={ size } />
            ),
          } } />
        <Tab.Screen
          name="Record"
          component={ RecordView }
          options={ {
            tabBarLabel: 'Record',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (

              <Feather  name="circle" color={ color } size={ size } />

            ),
          } } />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
