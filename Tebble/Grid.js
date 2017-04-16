import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {View, StyleSheet, Text} from 'react-native';
import Cell from './cell';

export class Grid extends Component{

        constructor(props) {
        super(props);
        this.state = {
            w: props.w,
            h: props.h,
            grid: [],
            score: 0,
            started: false,
            gameOver: true
        }
        this.grid = [];
        this.speed = 450;

    }

    createGrid() {
        const {w, h} = this.state;
        var grid = [];
        var row = [];

        for(i = 1; i <= h; i++) { //h is 20, so i want 20 rows
            for(j = 1; j <= w; j++) { // w is 10
                var cell = 0;
                row.push(cell);
            }
            grid.push(row);
            row = [];
        }
        this.grid = grid;
        this.setState({grid}, () => {
        });
    }



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