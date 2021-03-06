import React, { Component } from 'react';
import {  View, Text, ScrollView, ToastAndroid} from 'react-native';
import {
	RkCard, RkTextInput, RkText, RkButton
} from 'react-native-ui-kitten'
import firebase from 'react-native-firebase'
const UserDB = firebase.database().ref('/users')
import {Color} from '../config/theme.json'

export default class AccountPage extends Component {
	static navigationOptions = {
		title : 'My Account'
	}
	constructor(props) {
	  super(props)
	
	  this.state = {
			name : '',
			email : '',
			phone : ''
	  };

	  this.unsubscriber = null
	};
	
	getInfoAkun() {
		let userLogin = firebase.auth().currentUser
		
		const cUser = UserDB.child('/' + userLogin.uid)
		cUser.once('value', (v) => {
			let pData = v.val()
			this.setState({
				name : pData.name,
				phone : pData.phone,
				email : pData.email
			})
		})
	}

	simpanAkun() {
		let userLogin = firebase.auth().currentUser
		const cUser = UserDB.child('/' + userLogin.uid)

		if (cUser) {
			let pData = {
				name : this.state.name,
				phone : this.state.phone,
				email : this.state.email
			}
			cUser.update(pData)
			ToastAndroid.show('Berhasil Edit User', ToastAndroid.SHORT)
			// this.props.navigation.goBack()
	
		}
	}

	componentDidMount() {
		this.getInfoAkun()
	}

	componentWillUnmount() {
		if (this.unsubscriber) {
			this.unsubscriber()
		}
	}

  render() {
	return (
	  <ScrollView style={{padding : 10}}>
		<RkCard>
			<View rkCardContent>
				<RkText>Nama</RkText>
				<RkTextInput
					rkType="rounded"
					value={this.state.name}
					onChangeText={(name) => this.setState({name})}/>

				<RkText>Nomor Hp</RkText>
				<RkText style={{fontSize: 11}}>*) Pastikan Nomor Hp anda aktif, untuk keperluan notifikasi dari system</RkText>
				<RkTextInput
					rkType="rounded"
					value={this.state.phone}
					keyboardType="phone-pad"
					onChangeText={(phone) => this.setState({phone})}/>

				<RkText>Email</RkText>
				<RkTextInput rkType="rounded" value={this.state.email} onChangeText={(email) => this.setState({email})} keyboardType="email-address"/>

				<RkButton
					onPress={this.simpanAkun.bind(this)}
					rkType="rounded" style={{backgroundColor: Color.primary, width : 200}}>UBAH AKUN SAYA</RkButton>
			</View>
		</RkCard>
	  </ScrollView>
	);
  }
}
