import React, { Component } from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Modal, TextInput} from 'react-native';

export class GameOver extends Component {
    constructor(props){
        super(props);
        this.state = {
            gameStart : true,
            name : ''
        }
    }

    startGame(){
        this.setState({gameStart:false});
        this.props.restart();
    }

    saveName(text){
        this.props.saveName(text);
        this.setState({name : text});
    }

    render(){
        return (
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={true}
                    style={{flex: 1}}
                >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.96)'}}>
                        <Text style={{fontSize: 50, fontWeight: '800'}}>
                              <Text style={{color: 'indianred'}}>G</Text>
                              <Text style={{color: 'lightsalmon'}}>A</Text>
                              <Text style={{color: 'palegoldenrod'}}>M</Text>
                              <Text style={{color: 'lightgreen'}}>E</Text>
                              <Text> </Text>
                              <Text style={{color: 'lightseagreen'}}>O</Text>
                              <Text style={{color: 'pink'}}>V</Text>
                              <Text style={{color: 'plum'}}>E</Text>
                              <Text style={{color: 'mediumorchid'}}>R</Text>
                        </Text>
                        <Text style={{fontSize: 24, color: 'black', fontWeight: '800'}}>
                            Final Score: {this.props.score}
                        </Text>
                        <TextInput
                            style={{height: 40, color: 'black', paddingLeft: 54, fontStyle: 'italic'}}
                            placeholderTextColor = 'black'
                            placeholder='Enter your name for the leaderboard'
                            onChangeText={(text) => this.saveName(text)}
                            maxLength={24}
                        />
                        <Text style={{fontSize: 12, color: 'black'}}>
                            (Name cannot contain ".", "#", "$", "[", or "]")
                        </Text>
                        <TouchableOpacity onPress={() => {
                            var name = this.state.name;
                            if (name.length!=0 && !name.includes('.') && !name.includes('#') && !name.includes('$') && !name.includes('[') && !name.includes(']')) {
                                this.props.addToLeaderboard();
                            }
                        }}
                        >
                             <Text style={{fontSize: 32, color: 'lightseagreen', fontWeight: '800'}}>
                                SUBMIT
                             </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.startGame()}}>
                            <Text style={{fontSize: 32, color: 'lightsalmon', fontWeight: '800'}}>
                                TRY AGAIN
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )
    }
}

export default GameOver;
