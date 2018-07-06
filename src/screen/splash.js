import React, { Component } from 'react';
import {  View, Text, Image } from 'react-native';
import Firebase from 'react-native-firebase';
import Home from './home'
import HomeAdmin from './admin'
import Login from './login'

export default class Splash extends Component {
	static navigationOptions = {
		header : null
	}

	constructor(props) {
	  super(props)
	
	  this.state = {
		loggedIn : false,
		loaded : false,
		role : ''
	  };
	};
	
	componentDidMount() {
		this.loggedIn()
	}

	loggedIn() {
		Firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				Firebase.database().ref('users').child(user.uid).once('value', (userData) => {
					const uV = userData.val()
					if (uV) {
						if (user.emailVerified) {
							this.setState({
								loggedIn : true,
								loaded : true,
								role : uV.role_group
							})
						} else {
							Firebase.auth().signOut()							
							this.setState({
								loaded : true,
								loggedIn : false
							})	
						}
					} else {
						Firebase.auth().signOut()
						this.setState({
							loaded : true,
							loggedIn : false
						})
					}
				})
			} else {
				this.setState({
					loaded : true,
					loggedIn : false
				})				
			}
		})
	}

	render() {
		if (this.state.loaded) {
			if (this.state.loggedIn) {
				if (this.state.role == 'user') {
					return <Home/>
				} else if (this.state.role == 'admin') {
					return <HomeAdmin/>
				} else {
					return <View></View>
				}
			} else {
				return <Login {...this.props} onLogin={(loggedIn) => this.setState({loggedIn})}/>
			}
		} else {
			return (
				<View style={{flex : 1, justifyContent : 'center', alignItems : 'center', backgroundColor : '#FEFEFE'}}>
					<Image source={require('../assets/img/logo.png')} style={{width : 300, height : 200}}/>
				</View>
			)
		}
	}
}
