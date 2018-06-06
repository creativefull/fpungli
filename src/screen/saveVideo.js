import React, { Component } from 'react';
import {  View, Text, ScrollView, Dimensions, AsyncStorage, Alert, ActivityIndicator} from 'react-native';
import {
	RkCard, RkTextInput, RkText, RkButton
} from 'react-native-ui-kitten'
import firebase from 'react-native-firebase'
import {NavigationActions} from 'react-navigation'

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
			type : 'video',
			location : {
				latitude : 0,
				longitude : 0
			},
			judul : '',
			status : 'pending',
			uid : '',
			loading : true,
			created_at : new Date()
		};

		this.submitLaporan = this.submitLaporan.bind(this);
	};

	componentDidMount() {
		this.getContentSaved()
	}

	async getContentSaved() {
		const xlocation = await AsyncStorage.getItem('location')
		const location = JSON.parse(xlocation)
		const assetLink = await AsyncStorage.getItem('dataVideo');

		firebase.auth().onAuthStateChanged((user) => {
			let uid = user.uid;
			let loading = false;
			this.setState({ location , assetLink, uid , loading});
		});
	}

	submitLaporan () {
		this.setState({
			loading : true,
		})
		let newChild = HistoryDB.push()
		const {alamat, judul, diskripsi, assetLink, type, location, status, created_at, uid} = this.state
		const user = firebase.auth().currentUser;

		if (judul == '' && alamat == '') {
			Alert.alert('Warning', 'Mohon Lengkapi Laporan Anda!')
		} else {
			let obj = {
				judul : judul,
				alamat : alamat,
				diskripsi : diskripsi,
				assetLink : assetLink,
				type : type,
				location : location,
				uid : uid,
				status : status,
				created_at : created_at,
				user_id : user.uid
			}

			newChild.set(obj);

			Alert.alert('Success', 'Terimakasih Sudah Mengirim Laporan, Kami Segera Menanggapi')
			const {navigation} = this.props;
			this.setState({
				loading : false,
			})
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

	renderLoading() {
		return (
			<View>
				<ActivityIndicator
					size="large"/>
			</View>
		)
	}

	render() {
		if (this.state.loading) {
			return this.renderLoading()
		} else {
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
								rkType="rounded full primary xlarge">KIRIM LAPORAN</RkButton>
						</View>
					</RkCard>
				</ScrollView>
			);
		}
	}
}