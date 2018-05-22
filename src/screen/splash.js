import React, { Component } from 'react';
import {  View, Text, Image } from 'react-native';
import Firebase from 'react-native-firebase';
import Home from './home'
import Login from './login'

export default class Splash extends Component {
	static navigationOptions = {
		header : null
	}
	constructor(props) {
	  super(props)
	
	  this.state = {
		 loggedIn : false,
		 loaded : false
	  };
	};
	
	componentDidMount() {
		this.loggedIn()
	}

	loggedIn() {
		Firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					loggedIn : true
				})
			}

			this.setState({
				loaded : true
			})
		})
	}

	render() {
		if (this.state.loaded) {
			if (this.state.loggedIn) {
				return <Home/>
			} else {
				return <Login {...this.props} onLogin={(loggedIn) => this.setState({loggedIn})}/>
			}
		} else {
			return (
				<View style={{flex : 1, justifyContent : 'center', alignItems : 'center', backgroundColor : '#FEFEFE'}}>
					<Image source={require('../assets/img/logo.png')} style={{width : 300, height : 100}}/>
				</View>
			)
		}
	}
}
