import React, { Component } from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Cell from './Cell';

export class Game extends Component {
    render() {
        return (
            <View style ={styles.container}>
            <Cell size = {48} string = {'A'} number = {1}/>
            <Cell size = {48} string = {'A'} number = {1}/>
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