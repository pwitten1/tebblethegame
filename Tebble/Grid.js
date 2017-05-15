import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
View,
StyleSheet,
Text,
Modal,
TouchableOpacity,
Image,
TextInput
} from 'react-native';
import Cell from './Cell';
//var Sound = require('react-native-sound');

export class Grid extends Component{

    constructor(props) {
        super(props);
        this.state = {
            w: props.w,
            h: props.h,
            grid: [],
            word: [],
            paused: false,
            rules: false,
            name: "Tebbler",
            score: 0
        }
        this.word = [];
        this.grid = [];
        this.touched = new Map();
        this.cells = new Map();
        this.speed = 25;
        this.blurAmount = 30;
        this.changeTile = this.changeTile.bind(this);
        this.dictionary = require('../Tebble/dict.json');
        this.counter = 0;
        this.thresh = 14;
        this.duration = 400; //10 sec before thresh decreases

        // Initialize Music
        // var sound = new Sound('../Tebble/rainbows.mp3', (error) => {
        //     if (error) {
        //       console.log('failed to load the sound', error);
        //       return;
        //     }
        //     // loaded successfully
        //     console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
        // });
        // sound.play();

    }

    componentDidMount() {
        this.createGrid();
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

    changeTile(i, j, cell) {
        var thisCell = this.cells.get(i+''+j);
        if (cell == 27){
            thisCell.changeLetter('3x');
            thisCell.changeColor('indianred');
            this.grid[i][j] = cell;
            return;
        }
        if (cell == 28){
            thisCell.changeLetter('2x');
            thisCell.changeColor('lightseagreen');
            this.grid[i][j] = cell;
            return;
        }
        thisCell.changeTextColor('white');
        thisCell.changeLetter(String.fromCharCode(64 + cell));
        thisCell.changePoints(this.scorer(cell));
        if (cell == 0){
            thisCell.changeColor('white');
            thisCell.changeTouched(false);
        }
        else{
            thisCell.changeColor('black');
        }
        this.grid[i][j] = cell;
    }

    gameOver(){
        this.props.gameOver(this.state.score);
    }

    loadNextTile() {
        var counter = 0;
        for (var i = 0; i < this.state.w; i++){
            if (this.grid[0][i] == 0){
                counter++;
            }
        }
        if (counter < this.state.w){ //The game is over
            var lead = Math.max(this.state.score, this.state.highscore); //update the local highscore
            this.setState({ highscore: lead});
            this.gameOver();
            return 0;
        }
        var cell = this.CharRandomizer();
        this.changeTile(0, 2, cell);
        return 1;
    }

    CharRandomizer() { //spawn letters at a semi-natural frequency
        var num = Math.round(Math.random()*115);
        if (num < 8) { return 1; } //letter is 'a'
        else if(num < 11) { return 2; } //letter is 'b'
        else if(num < 14) { return 3; } //letter is 'c'
        else if(num < 19) { return 4; } //letter is 'd'
        else if(num < 29) { return 5; } //letter is 'e'
        else if(num < 32) { return 6; } //letter is 'f'
        else if(num < 36) { return 7; } //letter is 'g'
        else if(num < 38) { return 8; } //letter is 'h'
        else if(num < 45) { return 9; } //letter is 'i'
        else if(num < 46) { return 10; } //letter is 'j'
        else if(num < 49) { return 11; } //letter is 'k'
        else if(num < 53) { return 12; } //letter is 'l'
        else if(num < 58) { return 13; } //letter is 'm'
        else if(num < 63) { return 14; } //letter is 'n'
        else if(num < 72) { return 15; } //letter is 'o'
        else if(num < 75) { return 16; } //letter is 'p'
        else if(num < 76) { return 17; } //letter is 'q'
        else if(num < 81) { return 18; } //letter is 'r'
        else if(num < 87) { return 19; } //letter is 's'
        else if(num < 93) { return 20; } //letter is 't'
        else if(num < 97) { return 21; } //letter is 'u'
        else if(num < 98) { return 22; } //letter is 'v'
        else if(num < 101) { return 23; } //letter is 'w'
        else if(num < 102) { return 24; } //letter is 'x'
        else if(num < 105) { return 25; } //letter is 'y'
        else if(num < 106) { return 26; } //letter is 'z'
        else if(num < 110) { return 27; } //TRIPLE TRIPLE TRIPLE
        else if(num < 115) { return 28; } //DOUBLE DOUBLE
        return 1; //this should not happen, but return 'a'
    }

    startGame() {
        this.setState({score: 0, word: []});
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
        if (i < this.state.h-1 && this.grid[i+1][j] == 0){
            this.changeTile(i+1, j, this.grid[i][j]);
            this.changeTile(i, j, 0);
            return 1;
        }
        if (this.grid[i][j] >= 27){ //checking for 3x or 2x tile
            if (i == this.state.h-1){ //hits bottom
                var cell = this.cells.get(i+''+j);
                cell.changeTextColor('white');
                this.changeTile(i, j, 0);
                this.grid[i][j] = 0;
                return 1;
            }
            else{ //hits another tile
                var cell = this.cells.get((i+1)+''+j);
                if (this.grid[i][j] == 27){
                    cell.changePoints(cell.state.points * 3);
                    cell.changeTextColor('indianred');
                }
                else{
                    cell.changePoints(cell.state.points * 2);
                    cell.changeTextColor('lightseagreen');
                }
                this.changeTile(i, j, 0);
                this.grid[i][j] = 0;
                return 1;
            }
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
                scoreupdater += this.cells.get(position[0]+''+position[1]).state.points;
                this.changeTile(position[0], position[1], 0);
            }
            else {
                this.cells.get(position[0]+''+position[1]).changeTouched(false);
            }

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
        this.counter++;
        if (this.counter % this.thresh != 0){
            return;
        }
        if (this.counter >= this.duration){
            console.log(this.thresh)
            this.thresh = Math.max(2, this.thresh - 1);
            this.counter = 0;
        }
        var didMove = 0;
        const {grid, w, h} = this.state;
        for(i = this.state.h-1; i >= 0; i--) {
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
                    if (direction == 'left' && this.grid[i][j-1] == 0){
                        this.changeTile(i, j-1, this.grid[i][j]);
                        this.changeTile(i, j, 0);
                        return;
                    }
                    if (direction == 'right' && this.grid[i][j+1] == 0){
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
                if (cellinfo[0] == i && cellinfo[1] == j) { //this cell has already been pushed, unclick and return
                    var tempword = this.state.word;
                    tempword.splice(counter, 1);
                    this.setState({word: tempword});
                    this.cells.get(i+''+j).changeTouched(false);
                    return;
                }
            }
            var wordTemp = this.state.word;
            wordTemp.push(i+','+j+','+this.grid[i][j]);
            this.setState({word: wordTemp});
        }
    }

    pause(){
        this.setState({paused: true});
        this.props.pause(this.state.score);
    }

    leader(){
        this.setState({paused: true});
        this.props.leader();
    }

    addToLeaderboard(name, score) {
        var users = this.leaderboardDatabase.ref('users');
        var nameExists = false;
        users.once('value')
            .then(function(snapshot) {
                var user = snapshot.child(name);
                nameExists = user.exists();
                if (nameExists) {
                    var highscore = Math.max(user.child('highscore').val(), score);
                    users.child(name).set({
                        'highscore': highscore
                    });
                }
                else {
                    users.child(name).set({
                        'highscore': score
                    });
                }
            });
    }

    retrieveLeaders() {
        var users = this.leaderboardDatabase.ref('users');
        var topTenNames = [];
        var topTenScores = [];
        users.orderByChild("highscore").once("value", function(snapshot) {
           snapshot.forEach(function(userSnap) {
              topTenNames.push(userSnap.key);
              topTenScores.push(userSnap.child('highscore').val());
          });
        });
        //console.log("scores " + topTenScores.toString());
        //console.log("Names " + topTenNames.toString());
        this.topTenNames = topTenNames.slice();
        this.topTenScores = topTenScores.slice();
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
        var size = 69;
        return this.state.grid.map((row, i) => {
            return (
                <View key={i} style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    {row.map((cell, j) => {
                        if(cell == 0){
                            var color = 'white';
                            var letter = ' ';
                        }
                        else {
                            var color = 'black';
                            var letter = String.fromCharCode(64 + cell);
                        }
                        var points = this.scorer(cell);
                        return <View key={j} onStartShouldSetResponder={() => this.clickTile(i, j)}><Cell key={j} ref={(c) => { this.cells.set(i+''+j, c);}} color={color} size={size} string={letter} points={points} textColor = {'white'}/></View>
                    })}
                </View>
            )
        })
    }

    render(){
        return (
            <View style={{flex: 1, justifyContent: 'space-around'}}>
                <View style={{padding: 15, paddingBottom: 5, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                    <Text style={{fontWeight: '700', fontSize: 42, color: 'darkgray'}}>Score: {this.state.score}</Text>
                    <TouchableOpacity onPress={() => this.leader()}>
                        <Image style={{width: 40, height: 40}} source={require('../Tebble/leaders.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pause()}>
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
