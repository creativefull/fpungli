import React, { Component } from 'react';
import { Alert, View, Text, ScrollView, Image, Keyboard, Animated} from 'react-native';
import {
	RkButton,
	RkText,
	RkTextInput,
	RkAvoidKeyboard,
	RkStyleSheet,
	RkTheme
} from 'react-native-ui-kitten';

import Firebase from 'react-native-firebase';
import {Color} from '../config/theme.json'

import app from '../config/app';

export default class Signup extends Component {
	static navigationOptions = {
		header : null
	}
	constructor(props) {
	  super(props)
	  this.state = {
			email : '',
	  }
	};

	onSubmit() {
		let {email} = this.state
		if (email != '') {
			Firebase.auth().sendPasswordResetEmail(this.state.email).then((result) => {
				Alert.alert('Sukses', 'Silahkan Cek Email Anda')
			}).catch((e) => {
				Alert.alert('Pendaftaran Gagal', e.message)
			})		
		} else {
			Alert.alert('Pendaftaran Gagal', 'Semua Informasi Harus Di Isi')
		}
	}
  render() {
	return (
		<RkAvoidKeyboard
			style={styles.screen}>
			<ScrollView style={{padding : 20}}>
				<View style={styles.header}>
					<Image
						style={[styles.image]}
						source={require('../assets/img/logo.png')}/>
					<RkText rkType="light h1">{"RESET PASSWORD".toUpperCase()}</RkText>
				</View>

				<View style={styles.content}>
					<View>
						<RkTextInput
							rkType="rounded"
							value={this.state.email}
							onChangeText={(email) => this.setState({ email })}
							placeholder="Email"/>
						<View style={{alignItems : 'center'}}>
							<RkButton
								onPress={this.onSubmit.bind(this)}
								rkType="primary large full rounded"
								style={{backgroundColor : Color.primary}}
								contentStyle={{ color : '#FFF' }}>
								RESET PASSWORD
							</RkButton>

							<View style={{marginTop : 20, marginBottom : 40}}>
								<RkText rkType="primary3">Belum Punya Account?</RkText>
								<RkButton rkType="clear" onPress={() => this.props.navigation.goBack()}>
									<RkText rkType="primary6" style={{color : 'red'}}> Masuk Sekarang </RkText>
								</RkButton>
							</View>
						</View>
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
		width : 150,
		height : 150
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