import React from 'react';

import {
  AppRegistry,
  Text,
  View,
} from 'react-native';

export default class GameScreen extends React.Component {
  static navigationOptions = {
    headerVisible: false
  };
  render() {
    return (
      <View>
        <Text>Play the game</Text>
      </View>
    );
  }
}