import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
View, 
StyleSheet, 
Text,
Modal,
TouchableOpacity,
Image,
TextInput,
AsyncStorage
} from 'react-native';
import Cell from './Cell';

export class Grid extends Component{

    constructor(props) {
        super(props);
        this.state = {
            w: props.w,
            h: props.h,
            grid: [],
            word: "",
            score: 0,
            started: false,
            gameOver: true,
            paused: false,
            leaderboard: false
        }
        this.name = ""
        this.word = "";
        this.grid = [];
        this.touched = new Map();
        this.cells = new Map();
        this.speed = 250;
        this.changeTile = this.changeTile.bind(this);
        this.dictionary = require('../Tebble/dict.json');
 
    }

    componentDidMount() {
        this.createGrid();
        var getname = AsyncStorage.getItem("tebbleName");
        this.setState({name: getname});
    }

    createGrid() {
        var grid = [];
        var row = [];

        for(i = 0; i < this.state.h; i++) { 
            for(j = 0; j < this.state.w; j++) { 
                var cell = 0;
                row.push(cell);
                this.touched.set(i+''+j, 0);
            }
            grid.push(row);
            row = [];
        }
        this.grid = grid;
        this.setState({grid}, () => {
        });
    }

    saveName(text) {
        this.setState({name: text});
        AsyncStorage.setItem("tebbleName", text);
        console.log(this.state.name);
        console.log(AsyncStorage.getItem("tebbleName"));
    }

    changeTile(i, j, cell) { //must fix!!!
        this.cells.get(i+''+j).changeLetter(String.fromCharCode(64 + cell));
        if (cell == 0){
            this.cells.get(i+''+j).changeColor('white');
        }
        else{
            this.cells.get(i+''+j).changeColor('black');

        }
        this.grid[i][j] = cell;
    }


    loadNextTile() { //Must fix!!!
        var counter = 0;
        for (var i = 0; i < this.state.w; i++){
            if (this.grid[0][i] == 0){
                counter++;
            }
        }
        if (counter == 0){
            this.setState({gameOver: !this.state.gameOver});
            return 0;
        }
        var cell = Math.round(Math.random()*25)+1;
        var startpos = Math.round(Math.random()*7);
        while (this.grid[0][startpos] != 0){
            startpos = Math.round(Math.random()*7);
        }
        this.changeTile(0, startpos, cell);
        return 1;
    }

    startGame() {
        this.setState({gameOver: false, started: true, score: 0});
        for(i = 0; i < this.state.h; i++) {
            for(j = 0; j < this.state.w; j++) {//resets the board before starting
                this.changeTile(i, j, 0);
            }
        }
        this.loadNextTile();
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            if(!this.state.paused && !this.state.leaderboard) {
                this.step()
            }
        }, this.speed)
    }

    MoveDown(i, j){
        if(this.grid[i+1][j] == 0){
            this.changeTile(i+1, j, this.grid[i][j]);
            this.changeTile(i, j, 0);
            return 1;
        }
        return 0;
    }

    wordchecker() {
        var position = this.dictionary.indexOf(this.word);
        console.log(typeof this.dictionary);
        return position;
    }


    step() {
        var didMove = 0;
        const {grid, w, h} = this.state;
        for(i = this.state.h-2; i >= 0; i--) { 
            for(j = this.state.w-1; j >= 0; j--) { 
                if(this.state.grid[i][j] != 0){
                    didMove += this.MoveDown(i, j);
                }
            }
        }

        if(didMove == 0) {
            //Nothing moved, time to send next block
            if (this.loadNextTile() == 0){
                clearInterval(this.interval);
                return;
            }
        }
    }

    shiftCells(direction){
        for (var i = 0; i < this.state.h-1; i++){
            for (var j = 0; j < this.state.w; j++){
                var color = this.touched.get(i+''+j) == 1 ? 'blue' : 'black';
                if (this.grid[i][j] != 0 && this.grid[i+1][j] == 0){
                    if (direction == 'left' && j == 0)
                        {return;}
                    if (direction == 'right' && j == this.state.w-1)
                        {return;}
                    if (direction == 'left'){
                        this.changeTile(i, j-1, this.grid[i][j]);
                        this.changeTile(i, j, 0);
                        return;
                    }
                    if (direction == 'right'){
                        this.changeTile(i, j+1, this.grid[i][j]);
                        this.changeTile(i, j, 0);
                        return;
                    }
                }

            }
        }
    }

    renderButtons() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingTop: 15}}>
                <TouchableOpacity onPress={() => this.shiftCells('left')}>
                    <Image style={styles.img} source={require('../Tebble/left-filled.png')}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.wordchecker()}>
                    <Image style={{width: 100, height: 40}} source={require('../Tebble/checkbutton.png')}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.shiftCells('right')}>
                    <Image style={styles.img} source={require('../Tebble/right-filled.png')}/>
                </TouchableOpacity>
            </View> ///
        )

    }

    clickTile(i, j){
        if(this.grid[i][j] != 0 && ((i < this.state.h-1 && this.grid[i+1][j] != 0) || i == this.state.h-1)){
            this.cells.get(i+''+j).changeTouched(true);
            this.touched.set(i+''+j, 1);
            this.setState({word: this.state.word + String.fromCharCode(64 + this.grid[i][j])})
        }
    }

    renderCells() {
        var size = 50;
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
                        return <View key={j} onStartShouldSetResponder={() => this.clickTile(i, j)}><Cell key={j} ref={(c) => { this.cells.set(i+''+j, c);}} color={color} size={size} string={letter}/></View>   
                    })}
                </View> ///
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
            </Modal> ///
        )
    }
    renderLeaders() {
        return (
            <Modal 
                animationType={"slide"}
                transparent={true}
                visible={this.state.leaderboard}
                style={{flex: 1}}
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(0,0,0,.5)'}}>
                    <Text style={{fontSize: 64, fontWeight: '800'}}>
                        <Text style={{color: 'blue'}}>Leaders</Text>
                    </Text>
                    <TouchableOpacity onPress={() => this.setState({leaderboard: false})}>
                        <Text style={{fontSize: 32, color: 'white', fontWeight: '500'}}>
                            RESUME    
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    renderSettings() {
        return (
            <Modal 
                animationType={"slide"}
                transparent={true}
                visible={this.state.paused}
                style={{flex: 1}}
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(0,0,0,.5)'}}>
                    <Text style={{fontSize: 32, fontWeight: '500', color: 'lightsalmon'}}>
                        Name: {this.name}
                    </Text>
                    <Text style={{fontSize: 64, fontWeight: '800'}}>
                        <Text style={{color: 'blue'}}>PAUSED</Text>
                    </Text>
                    <TextInput
                        style={{height: 40, paddingLeft: 100}}
                        placeholder='what is your name'
                        onChangeText={(text) => this.saveName(text)}
                    />
                    <TouchableOpacity onPress={() => this.setState({paused: false})}>
                        <Text style={{fontSize: 32, color: 'white', fontWeight: '500'}}>
                            RESUME    
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>///
        )
    }


    render(){
        return (
            <View style={{flex: 1, justifyContent: 'space-around'}}>
                <View style={{padding: 15, paddingBottom: 5, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                    <Text style={{fontWeight: '700', fontSize: 42, color: 'darkgray'}}>Score: {this.state.score}</Text>
                    <TouchableOpacity onPress={() => this.setState({leaderboard: true})}>
                        <Image style={{width: 40, height: 40}} source={require('../Tebble/leaders.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({paused: true})}>
                        <Image style={{width: 42, height: 42}} source={require('../Tebble/pausebutton.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={{paddingLeft: 15, paddingBottom: 10}}> 
                    <Text style={{fontWeight: '700', fontSize: 16, color: 'gray'}}>Word: {this.state.word}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <View style={{backgroundColor: 'white'}}>
                        {this.renderCells()}
                    </View>
                </View>
                {this.renderButtons()}
                {this.renderStart()}
                {this.renderSettings()}
                {this.renderLeaders()}
            </View>
        )
    }

}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : 'whitesmoke'
    },
    img: {
        width: 50,
        height: 50
    }

})

export default Grid;