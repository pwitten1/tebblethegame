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
			size: props.size,
			color: props.color,
			textColor: props.textColor,
			touched: false,
			points: props.points,
		}
	}

	changePoints(points){
		this.setState({points: points});
	}

	changeLetter(string){
		this.setState({letter: string});
	}

	changeColor(color){
		this.setState({color: color});
	}

	changeTouched(bool){
		this.setState({touched: bool});
	}

	changeTextColor(textColor){
		this.setState({textColor: textColor});
	}

    render() {
        var {string, number, size, color} = this.state;
        if (color == 'black' && this.state.touched == true){
        	color = 'darkorange';
        }

        return (
			<View style = {{borderColor: 'lightgray', backgroundColor: color , width: size, height:size, borderWidth: 0.5}}>
				<Text style={{textAlign: 'center', color: this.state.textColor, lineHeight: 27, borderColor: 'lightgray', fontSize: 34, fontWeight: '700'}}>{'\n'}{this.state.letter}</Text>
				<Text style={{textAlign: 'right', color: this.state.textColor, lineHeight: 7, borderColor: 'lightgray', fontSize: 15, fontWeight: '500'}}>{'\n'}{this.state.points}</Text>

        	</View>)
    }
};

export default Cell;
