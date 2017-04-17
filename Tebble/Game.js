import React, { Component } from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Grid from './Grid';

export class Game extends Component {
    render() {
        return (
            <View style ={styles.container}>
                <Grid w = {8} h = {16} />
        	</View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },

})

export default Game;