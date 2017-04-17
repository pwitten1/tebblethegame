import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
View, 
StyleSheet, 
Text,
Modal,
TouchableOpacity
} from 'react-native';
import Cell from './Cell';

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
        this.changeTile = this.changeTile.bind(this);

    }

    componentDidMount() {

        this.createGrid();
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
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

    changeTile(i, j, cell) { //must fix!!!
        var id = i + ',' + j;
        this.grid[0][0] = 0; //This is whats causing problems!!!!!
        if(cell == 0){
            // this.refs[id].changeColor('white');
            // this.refs[id].changeLetter(' ');
        }
        else{
            // this.refs[id].changeColor('black');
            // this.refs[id].changeLetter(String.fromCharCode(64 + cell));
        }
    }


    loadNextTile() { //Must fix!!!
        this.setState({gameOver: false, started: true, score: 0});
        var cell = this.getRandomInt(0, 26) + 1;
        var startpos = this.getRandomInt(0, this.state.w);
        this.changeTile(startpos, 0, cell);
    }

    startGame() {
        this.setState({gameOver: false, started: true, score: 0});
        for(i = 0; i < this.state.w; i++) {
            for(j = 0; j < this.state.h; j++) {//resets the board before starting
                this.changeTile(i, j, 0);
            }
        }
        this.loadNextTile();
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.step()
        }, this.speed)
    }

    MoveDown(i, j){
        if(this.state.grid[i][j + 1] == 0){
            this.state.grid[i][j + 1] = this.state.grid[i][j];
            this.state.grid[i][j] = 0;
            return 1;
        }
        return 0;
    }

    step() {
        var didMove = 0;
        const {grid, w, h} = this.state;
        for(i = 0; i < this.state.w; i++) { 
            for(j = this.state.h - 2; j >= 0; j--) { 
                if(this.state.grid[i][j] != 0){
                    didMove += this.MoveDown(i, j);
                }
            }
        }

        if(didMove > 0) {
            //Nothing moved, time to send next block
            this.loadNextTile();
        }

    }

    renderCells() {
        var size = 30;
        // console.log('rendering grid');
        return this.state.grid.map((row, i) => {
            return (
                <View key={i} style={{flexDirection: 'row'}}>
                    {row.map((cell, j) => {
                        if(cell == 0){
                            var color = 'white';
                            var letter = ' ';
                        }
                        else {
                            var color = 'black';
                            var letter = String.fromCharCode(64 + cell);
                        }
                        return <Cell ref = {i + "," +j} color={color} size={size} string={letter}/>   
                    })}
                </View>
                )
        })
    }

    renderStart() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.gameOver}
                style={{flex: 1}}
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(0,0,0,.5)'}}>
                    <Text style={{fontSize: 64, fontWeight: '800'}}>
                        <Text style={{color: 'blue'}}>T</Text>
                        <Text style={{color: 'orange'}}>E</Text>
                        <Text style={{color: 'yellow'}}>B</Text>
                        <Text style={{color: 'green'}}>B</Text>
                        <Text style={{color: 'red'}}>L</Text>
                        <Text style={{color: 'cyan'}}>E</Text>
                    </Text>
                    <TouchableOpacity onPress={() => {this.startGame()}}>
                        <Text style={{fontSize: 32, color: 'white', fontWeight: '500'}}>
                            {this.state.started ? 'TRY AGAIN' : 'START'}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

	render(){
		return (
            <View style={{flex: 1, justifyContent: 'space-around'}}>
            <View style={{paddingTop: 40, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontWeight: '700', fontSize: 26}}>Tebble</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <View style={{backgroundColor: 'white'}}>
                    {this.renderCells()}
                </View>

            </View>
            {this.renderStart()}

            </View>
        )
	}

}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : 'whitesmoke'
    },

})

export default Grid;