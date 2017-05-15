import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';

export class Leaderboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            paused: true,
        }
        this.topTenNames = props.users;
        this.topTenScores = props.scores;
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
                <Text style={{fontSize: 40, fontWeight: '800'}}>
                    <Text style={{color: 'lightseagreen'}}>LEADERBOARD</Text>
                </Text>
                <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>1. {this.topTenNames[9] + ': ' + this.topTenScores[9]}</Text>
                <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>2. {this.topTenNames[8] + ': ' + this.topTenScores[8]}</Text>
                <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>3. {this.topTenNames[7] + ': ' + this.topTenScores[7]}</Text>
                <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>4. {this.topTenNames[6] + ': ' + this.topTenScores[6]}</Text>
                <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>5. {this.topTenNames[5] + ': ' + this.topTenScores[5]}</Text>
                <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>6. {this.topTenNames[4] + ': ' + this.topTenScores[4]}</Text>
                <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>7. {this.topTenNames[3] + ': ' + this.topTenScores[3]}</Text>
                <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>8. {this.topTenNames[2] + ': ' + this.topTenScores[2]}</Text>
                <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>9. {this.topTenNames[1] + ': ' + this.topTenScores[1]}</Text>
                <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>10. {this.topTenNames[0] + ': ' + this.topTenScores[0]}</Text>
                <View paddingTop={50}>
                    <TouchableOpacity onPress={() => this.props.resume()}>
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

export default Leaderboard;
