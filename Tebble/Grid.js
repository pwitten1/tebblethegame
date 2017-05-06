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

    //NOTES:
    /*  Change word to an array that stores i+j+letter
        use ChangeTile to remove words, do not allow
        for reclicks, store order of Tiles in word!
    */

export class Grid extends Component{

    constructor(props) {
        super(props);
        this.state = {
            w: props.w,
            h: props.h,
            grid: [],
            word: [],
            score: 0,
            started: false,
            gameOver: true,
            paused: false,
            leaderboard: false
        }
        this.name = ""
        this.word = [];
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
            this.cells.get(i+''+j).changeTouched(false);
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
        var cell = this.CharRandomizer();
        var startpos = Math.round(Math.random()*7);
        while (this.grid[0][startpos] != 0){
            startpos = Math.round(Math.random()*7);
        }
        this.changeTile(0, startpos, cell);
        return 1;
    }

    CharRandomizer() { //spawn letters at a semi-natural frequency
        var num = Math.round(Math.random()*93);
        if (num < 5) { return 1; } //letter is 'a'
        else if(num < 8) { return 2; } //letter is 'b'
        else if(num < 10) { return 3; } //letter is 'c'
        else if(num < 13) { return 4; } //letter is 'd'
        else if(num < 20) { return 5; } //letter is 'e'
        else if(num < 22) { return 6; } //letter is 'f'
        else if(num < 26) { return 7; } //letter is 'g'
        else if(num < 30) { return 8; } //letter is 'h'
        else if(num < 36) { return 9; } //letter is 'i'
        else if(num < 38) { return 10; } //letter is 'j'
        else if(num < 41) { return 11; } //letter is 'k'
        else if(num < 46) { return 12; } //letter is 'l'
        else if(num < 50) { return 13; } //letter is 'm'
        else if(num < 57) { return 14; } //letter is 'n'
        else if(num < 62) { return 15; } //letter is 'o'
        else if(num < 64) { return 16; } //letter is 'p'
        else if(num < 65) { return 17; } //letter is 'q'
        else if(num < 70) { return 18; } //letter is 'r'
        else if(num < 76) { return 19; } //letter is 's'
        else if(num < 82) { return 20; } //letter is 't'
        else if(num < 87) { return 21; } //letter is 'u'
        else if(num < 88) { return 22; } //letter is 'v'
        else if(num < 89) { return 23; } //letter is 'w'
        else if(num < 90) { return 24; } //letter is 'x'
        else if(num < 92) { return 25; } //letter is 'y'
        else if(num < 93) { return 26; } //letter is 'z'
        return 1; //this should not happen, but return 'a'
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

    wordreturner() {
        var word1 = "";
        var i;
        for(i = 0; i < this.state.word.length; i++) {
            var charstorer = this.state.word[i].split(',');
            word1 += String.fromCharCode(64 + parseInt(charstorer[2]));
        }
        return word1;
    }

    wordchecker() {
        var selected = this.wordreturner();
        var spot = this.dictionary.indexOf(selected);
        var i;
        var scoreupdater = 0;
        for(i = 0; i < this.state.word.length; i++) {
            var position = this.state.word[i].split(',');
            if(spot != -1) {
                this.changeTile(position[0], position[1], 0);
                scoreupdater += this.scorer(position[2]);
            }
            else {
                this.cells.get(position[0]+''+position[1]).changeTouched(false);
            }

            console.log(position[0] + " " + position[1]);
        }
        this.setState({word: []});
        this.setState({score: this.state.score + scoreupdater});
    }

    scorer(letter) {

        if(letter == 1){ return 1; } //letter is 'a': worth 1 pt
        else if(letter == 2){ return 3; } //letter is 'b': worth 3 pts
        else if(letter == 3){ return 3; } //letter is 'c': worth 3 pts
        else if(letter == 4){ return 2; } //letter is 'd': worth 2 pts
        else if(letter == 5){ return 1; } //letter is 'e': worth 1 pt
        else if(letter == 6){ return 4; } //letter is 'f': worth 4 pts
        else if(letter == 7){ return 2; } //letter is 'g': worth 2 pts
        else if(letter == 8){ return 4; } //letter is 'h': worth 4 pts
        else if(letter == 9){ return 1; } //letter is 'i': worth 1 pt
        else if(letter == 10){ return 8; } //letter is 'j': worth 8 pts
        else if(letter == 11){ return 5; } //letter is 'k': worth 5 pts
        else if(letter == 12){ return 1; } //letter is 'l': worth 1 pt
        else if(letter == 13){ return 3; } //letter is 'm': worth 3 pts
        else if(letter == 14){ return 1; } //letter is 'n': worth 1 pt
        else if(letter == 15){ return 1; } //letter is 'o': worth 1 pt
        else if(letter == 16){ return 3; } //letter is 'p': worth 3 pts
        else if(letter == 17){ return 10; } //letter is 'q': worth 10 pts
        else if(letter == 18){ return 1; } //letter is 'r': worth 1 pt
        else if(letter == 19){ return 1; } //letter is 's': worth 1 pt
        else if(letter == 20){ return 1; } //letter is 't': worth 1 pt
        else if(letter == 21){ return 1; } //letter is 'u': worth 1 pt
        else if(letter == 22){ return 4; } //letter is 'v': worth 4 pts
        else if(letter == 23){ return 4; } //letter is 'w': worth 4 pts
        else if(letter == 24){ return 8; } //letter is 'x': worth 8 pts
        else if(letter == 25){ return 4; } //letter is 'y': worth 4 pts
        else if(letter == 26){ return 10; } //letter is 'z': worth 10 pts
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


    clickTile(i, j){
        if(this.grid[i][j] != 0 && ((i < this.state.h-1 && this.grid[i+1][j] != 0) || i == this.state.h-1)){
            this.cells.get(i+''+j).changeTouched(true);
            this.touched.set(i+''+j, 1);
            var counter;
            for (counter = 0; counter < this.state.word.length; counter++) {
                var cellinfo = this.state.word[counter].split(',');
                if (cellinfo[0] == i && cellinfo[1] == j) { //this cell has already been pushed, return
                    return;
                }
            }
            var wordTemp = this.state.word;
            wordTemp.push(i+','+j+','+this.grid[i][j]);
            this.setState({word: wordTemp});
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

    renderCells() {
        var size = 50;
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
                        <Text style={{fontSize: 24, color: 'green', fontWeight: '500'}}>
                            {this.state.started ? "Final Score: " + this.state.score : ''}
                        </Text>
                        <Text style={{fontSize: 32, color: 'salmon', fontWeight: '500'}}>
                            {this.state.started ? 'TRY AGAIN' : 'START'}
                        </Text>
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
                    <Text style={{fontWeight: '700', fontSize: 16, color: 'gray'}}>Word: {this.wordreturner()}</Text>
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