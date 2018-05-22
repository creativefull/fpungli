import React, { Component } from 'react';
import {  View, Text, Alert, ScrollView, Image, Keyboard, Animated} from 'react-native';
import {
	RkButton,
	RkText,
	RkTextInput,
	RkAvoidKeyboard,
	RkStyleSheet,
	RkTheme
} from 'react-native-ui-kitten';
import Firebase from 'react-native-firebase';

import app from '../config/app';

export default class LoginApp extends Component {
	static navigationOptions = {
		header : null
	}
	constructor(props) {
	  super(props)
	  this.state = {
		  imageHeight : new Animated.Value(100),
		  imageWidth : new Animated.Value(350),
		  opacityHeader : new Animated.Value(1),
		  loaded : false,
		  email : '',
		  password : ''
	  }
	  this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow.bind(this))
	  this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide.bind(this))
	};

	componentDidMount() {
	}

	keyboardWillShow(e) {
	}

	keyboardWillHide() {
	}

	componentWillUnmount() {
		this.keyboardWillShowSub.remove()
	}

	onLogin() {
		const {email, password} = this.state
		if (email != '' && password != '') {
			Firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password).then((result) => {
				this.props.onLogin(true)
			}).catch((e) => {
				Alert.alert('Login Gagal', 'Username / Password Tidak Cocok')
			})
		} else {
			Alert.alert('Login Gagal', 'Username / Password Masih Kosong')
		}
	}
	
	render() {
		return (
			<RkAvoidKeyboard
				style={styles.screen}>
				<ScrollView>
					<Animated.View style={styles.header}>
						<Animated.Image
							style={[styles.image, {width : this.state.imageWidth, height : this.state.imageHeight}]}
							source={require('../assets/img/logo.png')}/>
						<Animated.View style={{opacity : this.state.opacityHeader}}>
							<RkText rkType="light h1">{app.name.toUpperCase()}</RkText>
							<RkText rkType="logo h0">{app.description}</RkText>
						</Animated.View>
					</Animated.View>

					<View style={styles.content}>
						<View>
							<RkTextInput
								rkType="rounded"
								value={this.state.email}
								onChangeText={(email) => this.setState({ email })}
								placeholder="Email"/>
							<RkTextInput
								rkType="rounded"
								value={this.state.password}
								onChangeText={(password) => this.setState({ password })}
								placeholder="Password"
								secureTextEntry={true}/>
							<View style={{alignItems : 'center'}}>
								<RkButton
									onPress={this.onLogin.bind(this)}
									rkType="primary large full rounded"
									contentStyle={{ color : '#FFF' }}>
									LOGIN
								</RkButton>
							</View>
						</View>
					</View>

					<View style={styles.footer}>
						<View style={styles.textRow}>
							<RkText rkType="primary3">Belum Punya Account?</RkText>
							<RkButton rkType="clear" onPress={() => this.props.navigation.navigate('Signup')}>
								<RkText rkType="primary6"> Daftar Sekarang </RkText>
							</RkButton>
						</View>
					</View>
				</ScrollView>
			</RkAvoidKeyboard>
		);
	}
}

RkTheme.setType('RkText', 'h1', {
	fontSize: 25,
	fontWeight: 'bold',
})

let styles = RkStyleSheet.create(theme => ({
	screen : {
		padding : 20,
		paddingTop : 60,
		flex : 1,
		justifyContent: 'space-between',
		backgroundColor: '#FEFEFE',
	},
	header : {
		paddingBottom: 10,
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
	image : {
		width : 350,
		height : 100
	},
	content : {
		justifyContent: 'space-between',
	},
	footer : {
		marginTop: 20,
	},
	textRow : {
		flexDirection: 'row',
		justifyContent: 'center',
	}
})
)