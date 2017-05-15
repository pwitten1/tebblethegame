import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';

export class Pause extends Component {
    constructor(props){
        super(props);
        this.state = {
            paused: true
        }
    }

    resume(){
        this.props.resume();
    }

    render(){
        return (
        <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.paused}
            style={{flex: 1}}
        >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.96)'}}
            >
                <Text style={{fontSize: 32, fontWeight: '800', color: 'indianred'}}>
                    Hello, {this.props.name}!
                </Text>
                <Text style={{fontSize: 64, fontWeight: '800'}}>
                    <Text style={{color: 'lightseagreen'}}>PAUSED</Text>
                </Text>
                <Text style={{fontSize: 32, fontWeight: '800', color: 'indianred'}}>
                    High Score:
                </Text>
                <Text style={{fontSize: 32, fontWeight: '800', color: 'indianred'}}>
                    {this.props.highscore}
                </Text>
                <Text style={{fontSize: 32, fontWeight: '800', color: 'black'}}>
                    Current Score:
                </Text>
                <Text style={{fontSize: 32, fontWeight: '800', color: 'black'}}>
                    {this.props.score}
                </Text>
                <View paddingTop={50}>
                    <TouchableOpacity onPress={() => this.resume()}>
                        <Text style={{fontSize: 32, color: 'lightsalmon', fontWeight: '800'}}>
                            RESUME
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        )
    }
}

export default Pause;
