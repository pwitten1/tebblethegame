import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {View, StyleSheet, Text} from 'react-native';

export class Grid extends Component{
	render(){
		return (
            <View style={styles.container}>
                <Grid w={10} h={24}/>
            </View>
        )
	}
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },

})