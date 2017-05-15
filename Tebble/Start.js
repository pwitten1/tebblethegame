import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';

export class Start extends Component {
    constructor(props){
        super(props);
        this.state = {
            gameNotStart : props.visible
        }
    }

    startGame(){
        this.props.startGame();
    }

    render(){
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                style={{flex: 1}}
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.96)'}}
                >
                    <Text style={{fontSize: 64, fontWeight: '800'}}>
                        <Text style={{color: 'indianred'}}>T</Text>
                        <Text style={{color: 'lightsalmon'}}>E</Text>
                        <Text style={{color: 'palegoldenrod'}}>B</Text>
                        <Text style={{color: 'lightgreen'}}>B</Text>
                        <Text style={{color: 'lightseagreen'}}>L</Text>
                        <Text style={{color: 'plum'}}>E</Text>
                    </Text>
                    <TouchableOpacity onPress={() => {this.startGame()}}>
                        <Text style={{fontSize: 32, color: 'lightsalmon', fontWeight: '800'}}>
                            START
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}

export default Start;
