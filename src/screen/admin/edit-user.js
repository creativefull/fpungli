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
			name : '',
			email : '',
			phone : '',
			nik : '',
			role_group : ''
	  };

	  this.unsubscriber = null
	};
	
	getInfoAkun() {
		const {params} = this.props.navigation.state
		// alert(JSON.stringify(params))
		const cUser = UserDB.child('/' + params.key)
		cUser.once('value', (v) => {
			let pData = v.val()
			this.setState({
				nik : pData.nik,
				role_group : pData.role_group,
				name : pData.name,
				phone : pData.phone,
				email : pData.email
			})
		})
	}

	simpanAkun() {
		const {params} = this.props.navigation.state
		const cUser = UserDB.child(params.key)
		let pData = {
			nik : this.state.nik,
			name : this.state.name,
			phone : this.state.phone,
			email : this.state.email,
			role_group : this.state.role_group
		}
		cUser.update(pData)
		ToastAndroid.show('Berhasil Edit User', ToastAndroid.SHORT)
		this.props.navigation.goBack()
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
				<RkText>NIK</RkText>
				<RkTextInput
					rkType="rounded"
					value={this.state.nik}
					onChangeText={(nik) => this.setState({nik})}/>

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

				<RkText>Role Group</RkText>
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
