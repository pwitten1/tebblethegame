import React, {Component} from 'react';
import {
View,
Text,
TouchableOpacity,
StyleSheet
} from 'react-native';

export class Cell extends Component {
	constructor(props){
		super(props);
		this.state={
			letter: props.string,
			value: props.number,
			size: props.size,
		}
	}

	changeLetter(string){
		this.setState({string});
	}

	changeValue(number){
		this.setState({number});
	}

    render() {
        var {string, number, size} = this.state

        return (<View style = {{borderColor: 'black', backgroundColor: 'white', width: size, height:size, borderWidth: 0}}>
        		<TouchableOpacity>
        		<Text style={{textAlign: 'center', color:'black', lineHeight: 15}}>{'\n'}{this.state.letter}</Text>
        		</TouchableOpacity>
        	</View>)
    }
};

export default Cell;