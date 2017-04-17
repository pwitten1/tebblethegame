import React from 'react';
import Game from './Game';
import {
  AppRegistry,
  Text,
  View,
} from 'react-native';

export default class GameScreen extends React.Component {
  static navigationOptions = {
    title: 'Play the Game'
  };
  render() {
    return (
      <Game />
    );
  }
}