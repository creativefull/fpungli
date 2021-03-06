import React, { Component } from 'react';
import {  View, Text, ScrollView, Dimensions, AsyncStorage, Alert} from 'react-native';
import {
	RkCard, RkTextInput, RkText, RkButton
} from 'react-native-ui-kitten'
import firebase from 'react-native-firebase'
import {NavigationActions} from 'react-navigation'
import {Color} from '../config/theme.json'

const HistoryDB = firebase.database().ref('/laporan')
const {width, height} = Dimensions.get('screen')

export default class FormLapor extends Component {
	static navigationOptions = {
		title : 'Input Data'
	}

	constructor(props) {
	  super(props)
	
	  this.state = {
		 alamat : '',
		 diskripsi : '',
		 assetLink : '',
		 type : '',
		 location : {
			 latitude : 0,
			 longitude : 0
		 },
		 judul : '',
		 status : 'pending',
		 created_at : new Date()
	  };
	};
	
	async getContentSaved() {
		const xlocation = await AsyncStorage.getItem('location')
		const location = JSON.parse(xlocation)

		const assetLink = await AsyncStorage.getItem('dataImage')
		if (assetLink) {
			this.setState({
				type : 'image'
			})
		}
		
		this.setState({ location, assetLink })
	}

	sendMessage(data) {
		let url = 'https://fcm.googleapis.com/fcm/send'
		fetch(url, {
			headers : {
				'Authorization' : 'key=AIzaSyAGnf_KsQFhGF8M0oc7DoXzCqQ6QVtGf8E',
				'Content-Type' : 'application/json'
			},
			method : 'POST',
			body : JSON.stringify(data)
		}).then((x) => x.json()).then(console.log)
	}

	submitLaporan() {
		let newChild = HistoryDB.push()
		const {alamat, judul, diskripsi, assetLink, type, location, status, created_at} = this.state
		const user = firebase.auth().currentUser;

		if (judul == '' && alamat == '') {
			Alert.alert('Warning', 'Mohon Lengkapi Laporan Anda!')
		} else {
			newChild.set({
				judul : judul,
				alamat : alamat,
				diskripsi : diskripsi,
				assetLink : assetLink,
				type : type,
				location : location,
				status : status,
				created_at : created_at,
				user_id : user.uid
			})
			// SEND NOTIFICATION
			this.sendMessage({
				topic : 'admin',
				notification : {
					'body' : judul,
					'title' : 'Laporan Masuk',
				},
				'to' : '/topics/admin',
				'data' : {
					'type' : 'Laporan',
					'id' : newChild.key,
					'title' : judul
				}
			})	

			Alert.alert('Success', 'Terimakasih Sudah Mengirim Laporan, Kami Segera Menanggapi')
			const {navigation} = this.props
			navigation.navigate('MapLocation')
			// navigation.dispatch(
			// 	NavigationActions.reset({
			// 		index : 0,
			// 		key : null,
			// 		actions : [
			// 			NavigationActions.navigate({
			// 				routeName : 'MapLocation'
			// 			})
			// 		]						
			// 	})
			// )
		}
	}

	componentDidMount() {
		this.getContentSaved()
	}

	render() {
		return (
			<ScrollView style={{padding : 10}}>
				<RkCard>
					<View rkCardContent>
						<RkText>Judul</RkText>
						<RkTextInput rkType="rounded" onChangeText={(judul) => this.setState({judul})}/>

						<RkText>Alamat Lengkap / Lokasi</RkText>
						<RkTextInput rkType="rounded" onChangeText={(alamat) => this.setState({alamat})}/>
		
						<RkText>Diskripsi</RkText>
						<RkTextInput
							onChangeText={(diskripsi) => this.setState({diskripsi})}						
							multiline={true}
							style={{height : 100, borderWidth: 1,borderColor: '#CCC', borderRadius: 20,}}/>

						<RkButton
							onPress={this.submitLaporan.bind(this)}
							rkType="rounded full xlarge" style={{backgroundColor: Color.primary}}>KIRIM LAPORAN</RkButton>
					</View>
				</RkCard>
			</ScrollView>
		);
	}
}
