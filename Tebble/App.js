import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  Button,
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './HomeScreen'
import GameScreen from './GameScreen'
import SettingScreen from './SettingScreen'

const App = StackNavigator({
  Home: { screen: HomeScreen },
  Game: { screen: GameScreen },
  Settings: { screen: SettingScreen },
});

AppRegistry.registerComponent('Tebble', () => App);
