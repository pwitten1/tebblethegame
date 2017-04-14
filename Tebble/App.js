import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  Button,
} from 'react-native';
import { StackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
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
      </View> /// stop annoying editor stuff
    );
  }
}

class GameScreen extends React.Component {
  static navigationOptions = {
    title: 'Play the Game',
  };
  render() {
    return (
      <View>
        <Text>Play the game</Text>
      </View>
    );
  }
}

class SettingScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };
  render() {
    return (
      <View>
        <Text>Settings</Text>
      </View>
    );
  }
}

const App = StackNavigator({
  Home: { screen: HomeScreen },
  Game: { screen: GameScreen },
  Settings: { screen: SettingScreen },
});

AppRegistry.registerComponent('Tebble', () => App);
