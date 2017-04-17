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
			color: props.color,

		}
	}

	changeLetter(string){
		this.setState({string});
	}

	changeColor(color){
		this.setState({color});
	}

	changeValue(number){
		this.setState({number});
	}

    render() {
        var {string, number, size, color} = this.state

        return (<View style = {{borderColor: 'black', backgroundColor: color , width: size, height:size, borderWidth: 0.5}}>
        		<TouchableOpacity>
        		<Text style={{textAlign: 'center', color:'white', lineHeight: 10}}>{'\n'}{this.state.letter}</Text>
        		</TouchableOpacity>
        	</View>)
    }
};

export default Cell;