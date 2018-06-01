import React, { Component } from 'react';
import {  View, Text, } from 'react-native';

export default class CreateNews extends Component {
	static navigationOptions = ({navigation}) => ({
		title : 'BUAT ARTIKEL BARU'
	})

	render() {
		return (
		<View>
			<Text> Create News </Text>
		</View>
		);
	}
}
