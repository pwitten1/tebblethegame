import React from 'react';

import {
  AppRegistry,
  Text,
  View,
} from 'react-native';

export default class SettingScreen extends React.Component {
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