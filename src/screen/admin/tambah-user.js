import React, { Component } from 'react';
import {  View, Text, ScrollView, ToastAndroid, Picker} from 'react-native';
import {
	RkCard, RkTextInput, RkText, RkButton
} from 'react-native-ui-kitten'
import firebase from 'react-native-firebase'
const UserDB = firebase.database().ref('/users')

export default class AccountPage extends Component {
	static navigationOptions = {
		title : 'My Account'
	}
	constructor(props) {
	  super(props)
	
	  this.state = {
		role_group : '',
		nik : '',
		name : '',
		email : '',
		phone : '',
		alamat : '',
		password : '',
		cpassword : ''
  };

	  this.unsubscriber = null
	};
	
	simpanAkun() {
		const cUser = firebase.auth()
		let pData = {
			name : this.state.name,
			phone : this.state.phone,
			email : this.state.email
		}

		let userData = {
			email: this.state.email,
			emailVerified: true,
			phoneNumber: this.state.phone,
			password: this.state.password,
			displayName: this.state.name,
		}

		cUser.createUserWithEmailAndPassword(this.state.email, this.state.password).then((result) => {
			this.sendData(result.user.uid)			
			ToastAndroid.show('Berhasil Tambah User', ToastAndroid.SHORT)
			this.props.navigation.goBack()
		})

	}

	sendData(user_id) {
		firebase.database().ref('users/' + user_id).set({
			nik : this.state.nik,
			name : this.state.name,
			phone : this.state.phone,
			email : this.state.email,
			alamat : this.state.alamat,
			password : this.state.password,
			role_group : 'user'
		})
	}

	componentDidMount() {
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
				<RkTextInput
					rkType="rounded"
					value={this.state.nik}
					onChangeText={(nik) => this.setState({ nik })}
					placeholder="NIK (Nomor Induk Kependudukan)"/>
				<RkTextInput
					rkType="rounded"
					value={this.state.name}
					onChangeText={(name) => this.setState({ name })}
					placeholder="Nama"/>
				<RkTextInput
					rkType="rounded"
					value={this.state.alamat}
					onChangeText={(alamat) => this.setState({ alamat })}
					placeholder="Alamat"/>
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
				<Picker
					selectedValue={this.state.role_group}
					style={{ height: 50, width: 100 }}
					onValueChange={(role_group, itemIndex) => this.setState({role_group})}>
					<Picker.Item label="Administrator" value="admin" />
					<Picker.Item label="User" value="user" />
				</Picker>

				<RkButton
					onPress={this.simpanAkun.bind(this)}
					rkType="rounded primary">
					<RkText style={{fontSize : 12, color : '#FFF'}}>SIMPAN</RkText>
				</RkButton>
			</View>
		</RkCard>
	  </ScrollView>
	);
  }
}
