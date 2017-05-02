import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import Game from './Game';

class App extends Component{
  render() {
  	return(
  		<Game/>
  		)
  }
}

AppRegistry.registerComponent('Tebble', () => App);
