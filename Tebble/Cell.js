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
			touched: false,
		}
	}

	changeLetter(string){
		this.setState({letter: string});
	}

	changeColor(color){
		this.setState({color: color});
	}

	changeValue(number){
		this.setState({value: number});
	}

	changeTouched(bool){
		this.setState({touched: bool});
	}

    render() {
        var {string, number, size, color} = this.state;
        if (color == 'black' && this.state.touched == true){
        	color = 'darkorange';
        }
        return (<View style = {{borderColor: 'lightgray', backgroundColor: color , width: size, height:size, borderWidth: 0.5}}>
        		<Text style={{textAlign: 'center', color:'white', lineHeight: 22.5, borderColor: 'lightgray', fontSize: 30}}>{'\n'}{this.state.letter}</Text>
        	</View>)
    }
};

export default Cell;