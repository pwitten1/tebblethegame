import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Alert
} from 'react-native';


export default class App extends Component {

  state = {game: false,}

  _handlePress() {
    this.setState({ game: !this.state.game });
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
             Tebble
          </Text>
          <View style = {styles.bton}>
            <Button 
              onPress={() => this._handlePress()}
              title="Play"
              accessibilityLabel="Learn more about this purple button"/>
          </View>
        </View> 
      );
  }


}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  welcome: {
    fontSize: 40,
    margin: 40,
  },
});