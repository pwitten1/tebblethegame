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
import * as firebase from 'firebase';

export class Grid extends Component{

    constructor(props) {
        super(props);
        this.state = {
            w: props.w,
            h: props.h,
            grid: [],
            word: [],
            highscore: 0,
            score: 0,
            started: false,
            gameOver: true,
            paused: false,
            leaderboard: false,
            rules: false,
            name: ""
        }
        this.word = [];
        this.grid = [];
        this.touched = new Map();
        this.cells = new Map();
        this.speed = 250;
        this.changeTile = this.changeTile.bind(this);
        this.dictionary = require('../Tebble/dict.json');
        this.topTenNames = [];
        this.topTenScores = [];

        // Initialize Firebase
        var config = {
          apiKey: "AIzaSyApDh39qPWTvfH92eEq79agpv5fyTsjcMI",
          authDomain: "tebble-15923.firebaseapp.com",
          databaseURL: "https://tebble-15923.firebaseio.com",
          projectId: "tebble-15923",
          storageBucket: "tebble-15923.appspot.com",
          messagingSenderId: "347709083033"
        };
        firebase.initializeApp(config);
        this.leaderboardDatabase = firebase.database();
    }

    componentDidMount() {
        this.createGrid();
        var item = AsyncStorage.getItem("Local_highscore");
        item.then((highscoreStr)=>{
            if (highscoreStr !== undefined) {
                this.setState({highscore: parseInt(highscoreStr, 10)});
            }
        });
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
    }

    changeTile(i, j, cell) {
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


    loadNextTile() {
        var counter = 0;
        for (var i = 0; i < this.state.w; i++){
            if (this.grid[0][i] == 0){
                counter++;
            }
        }
        if (counter == 0){ //The game is over
            var lead = Math.max(this.state.highscore, this.state.score); //update the local highscore
            this.setState({gameOver: !this.state.gameOver, highscore: lead});
            AsyncStorage.setItem("Local_highscore", lead.toString());
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
        this.setState({gameOver: false, started: true, score: 0, word: []});
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


    clickTile(i, j) {
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
        var size = 60;
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
                        <Text style={{color: 'red'}}>T</Text>
                        <Text style={{color: 'orange'}}>E</Text>
                        <Text style={{color: 'yellow'}}>B</Text>
                        <Text style={{color: 'green'}}>B</Text>
                        <Text style={{color: 'blue'}}>L</Text>
                        <Text style={{color: 'purple'}}>E</Text>
                    </Text>
                    <TouchableOpacity onPress={() => {this.startGame()}}>
                        <Text style={{fontSize: 32, color: 'salmon', fontWeight: '800'}}>
                            START
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    renderGameOver() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.gameOver}
                style={{flex: 1}}
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(0,0,0,.5)'}}>
                    <Text style={{fontSize: 50, fontWeight: '800'}}>
                          <Text style={{color: 'red'}}>G</Text>
                          <Text style={{color: 'orange'}}>A</Text>
                          <Text style={{color: 'yellow'}}>M</Text>
                          <Text style={{color: 'green'}}>E</Text>
                          <Text> </Text>
                          <Text style={{color: 'blue'}}>O</Text>
                          <Text style={{color: 'cyan'}}>V</Text>
                          <Text style={{color: 'pink'}}>E</Text>
                          <Text style={{color: 'purple'}}>R</Text>
                    </Text>
                    <Text style={{fontSize: 24, color: 'white', fontWeight: '500'}}>
                        Final Score: {this.state.score}
                    </Text>
                    <TextInput
                        style={{height: 40, color: 'white', paddingLeft: 54}}
                        placeholderTextColor = 'white'
                        placeholder='Enter your name for the leaderboard'
                        onChangeText={(text) => this.saveName(text)}
                    />
                    <TouchableOpacity onPress={() => {
                        this.addToLeaderboard(this.state.name, this.state.score);
                        this.setState({started: false});
                    }}>
                        <Text style={{fontSize: 32, color: 'lightseagreen', fontWeight: '800'}}>
                            SUBMIT
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.startGame()}}>
                        <Text style={{fontSize: 32, color: 'salmon', fontWeight: '800'}}>
                            TRY AGAIN
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    renderLeaders() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.leaderboard}
                style={{flex: 1}}
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(0,0,0,.2)'}}>
                    <Text style={{fontSize: 40, fontWeight: '800'}}>
                        <Text style={{color: 'lightseagreen'}}>LEADERBOARD</Text>
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '800'}}>
                        1. {this.topTenNames[0]}: {this.topTenScores[0]}
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '800'}}>
                        2. {this.topTenNames[1]}: {this.topTenScores[1]}
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '800'}}>
                        3. {this.topTenNames[2]}: {this.topTenScores[2]}
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '800'}}>
                        4. {this.topTenNames[3]}: {this.topTenScores[3]}
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '800'}}>
                        5. {this.topTenNames[4]}: {this.topTenScores[4]}
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '800'}}>
                        6. {this.topTenNames[5]}: {this.topTenScores[5]}
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '800'}}>
                        7. {this.topTenNames[6]}: {this.topTenScores[6]}
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '800'}}>
                        8. {this.topTenNames[7]}: {this.topTenScores[7]}
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '800'}}>
                        9. {this.topTenNames[8]}: {this.topTenScores[8]}
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '800'}}>
                        10. {this.topTenNames[9]}: {this.topTenScores[9]}
                    </Text>
                    <TouchableOpacity onPress={() => this.setState({leaderboard: false})}>
                        <Text style={{fontSize: 32, color: 'white', fontWeight: '800'}}>
                            BACK
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>///
        )
    }
    /*
    renderRules() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.rules}
                style={{flex: 1}}
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'rgb(0,0,0)'}}>
                    <Text style={{fontSize: 42, fontWeight: '800'}}>
                        <Text style={{color: 'crimson'}}>Tebble: the rules</Text>
                    </Text>
                    <Image style={{height: 100, width: 200}} source={require('../Tebble/tap.png')}/>
                    <Text style={{fontSize: 20, fontWeight: '400', color: 'bisque'}}>
                        Tap on the letters in order to form words
                    </Text>
                    <Image style={{height: 100, width: 200}} source={require('../Tebble/checkword.png')}/>
                    <Text style={{fontSize: 20, fontWeight: '400', color: 'bisque'}}>
                        Submitting words will cause the letters to disappear, and increase your score
                    </Text>
                    <Image style={{height: 60, width: 60}} source={require('../Tebble/left-filled.png')}/>
                    <Image style={{height: 60, width: 60}} source={require('../Tebble/right-filled.png')}/>
                    <Text style={{fontSize: 20, fontWeight: '400', color: 'bisque'}}>
                        Use the two arrow keys to move the letters as they fall
                    </Text>
                    <Text style={{fontSize: 20, fontWeight: '400', color: 'bisque'}}>
                        The game ends when the boardfills up all the way!
                    </Text>

                    <TouchableOpacity onPress={() => this.setState({rules: false})}>
                        <Text style={{fontSize: 32, color: 'white', fontWeight: '500'}}>
                            RESUME
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>///
        )
    }    */

    renderSettings() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.paused}
                style={{flex: 1}}
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(0,0,0,0.2)'}}>
                    <Text style={{fontSize: 64, fontWeight: '800'}}>
                        <Text style={{color: 'lightseagreen'}}>PAUSED</Text>
                    </Text>
                    <Text style={{fontSize: 48, fontWeight: '800', color: 'black'}}>
                        High Score:
                    </Text>
                    <Text style={{fontSize: 48, fontWeight: '800', color: 'black'}}>
                        {this.state.highscore}
                    </Text>
                    <TouchableOpacity onPress={() => this.setState({paused: false})}>
                        <Text style={{fontSize: 32, color: 'white', fontWeight: '500'}}>
                            RESUME
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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
                {this.state.started ? this.renderGameOver() : this.renderStart()}
                {this.renderSettings()}
                {this.retrieveLeaders()}
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
