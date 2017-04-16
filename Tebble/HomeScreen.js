import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  Button,
} from 'react-native';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Tebble the Game',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text> Tebble the Game </Text>
        <Button
          onPress={() => navigate('Game')}
          title="Play"
        />
        <Button
          onPress={() => navigate('Settings')}
          title="Settings"
        />
      </View> 
    );
  }
}