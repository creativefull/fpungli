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

import app from '../config/app';

export default class Signup extends Component {
	static navigationOptions = {
		header : null
	}
	constructor(props) {
	  super(props)
	  this.state = {
		  name : 'hello',
		  email : '',
		  phone : '',
		  password : '',
		  cpassword : ''
	  }
	};

	sendData(user_id) {
		Firebase.database().ref('users/' + user_id).set({
			name : this.state.name,
			phone : this.state.phone,
			email : this.state.email,
			password : this.state.password
		}).then((result) => {
			Firebase.auth().currentUser.sendEmailVerification()
			Alert.alert('Pendaftaran Berhasil', 'Silahkan Cek Email Anda Untuk Verifikasi')
		}).catch((e) => {
			Alert.alert('Pendaftaran Gagal', e.message)
		})
	}

	onSubmit() {
		let {name, email, phone, password, cpassword} = this.state
		if (name != '' && email != '' && phone != '' && password != '' && cpassword != '') {
			if (password != cpassword) {
				return Alert.alert('Error', 'Konfirmasi Password Tidak Cocok')
			}

			Firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password).then((result) => {
				// alert(JSON.stringify(result))
				Firebase.auth().onAuthStateChanged((user) => {
					this.sendData(result.user.uid)
				})
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
						source={require('../assets/img/register.png')}/>
					<RkText rkType="light h1">{"PENDAFTARAN".toUpperCase()}</RkText>
				</View>

				<View style={styles.content}>
					<View>
						<RkTextInput
							rkType="rounded"
							value={this.state.name}
							onChangeText={(name) => this.setState({ name })}
							placeholder="Nama"/>
						<RkTextInput
							rkType="rounded"
							value={this.state.email}
							onChangeText={(email) => this.setState({ email })}
							placeholder="Email"/>
						<RkTextInput
							rkType="rounded"
							value={this.state.phone}
							onChangeText={(phone) => this.setState({ phone })}
							placeholder="Phone"/>
						<RkTextInput
							rkType="rounded"
							value={this.state.password}
							onChangeText={(password) => this.setState({ password })}
							placeholder="Password"
							secureTextEntry={true}/>
						<RkTextInput
							rkType="rounded"
							value={this.state.cpassword}
							onChangeText={(cpassword) => this.setState({ cpassword })}
							placeholder="Konfirmasi Password"
							secureTextEntry={true}/>
						<View style={{alignItems : 'center'}}>
							<RkButton
								onPress={this.onSubmit.bind(this)}
								rkType="primary large full rounded"
								contentStyle={{ color : '#FFF' }}>
								DAFTAR
							</RkButton>

							<View style={{marginTop : 20, marginBottom : 40}}>
								<RkText rkType="primary3">Belum Punya Account?</RkText>
								<RkButton rkType="clear" onPress={() => this.props.navigation.goBack()}>
									<RkText rkType="primary6"> Masuk Sekarang </RkText>
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