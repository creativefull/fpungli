import React, { Component } from 'react';
import {  View, Text, Linking, ScrollView, Image, TouchableOpacity, NativeModules} from 'react-native';
import {
	RkText,
	RkCard,
	RkStyleSheet,
	RkTheme,
	RkButton,
    RkTextInput
} from 'react-native-ui-kitten'
import firebase from 'react-native-firebase';
import MapView, { Marker } from 'react-native-maps';
import {Color} from '../../config/theme.json'
const {RNSms} = NativeModules
import Video from 'react-native-video'

const moment = require('moment')
moment.locale('id')

RkTheme.setType('RkText', 'hintColor', {
	fontSize: 11,
	color : '#a1a1a1'
})

RkTheme.setType('RkText', 'header4', {
	fontSize: 15,
	color : '#666'
})

RkTheme.setType('RkButton', 'btnAction', {
	marginRight: 5,
})

export default class LaporanDetail extends Component {
	static navigationOptions = ({navigation}) => ({
		title : navigation.state.params.title,
		// headerRight : (
		// 	<RkButton rkType="circle clear small" onPress={() => navigation.state.params.handleLogout()}>
		// 		<RkText rkType="primary" style={{color : Color.secondary}}>Tambah User</RkText>
		// 	</RkButton>
		// )
	})

	constructor(props) {
		super(props)

		this.state = {
			data : null,
			keterangan : '',
			setting : {},
			paused : false
		};
	};
	
	getData(id) {
		firebase.database().ref('/laporan/' + id).on('value', (results) => {
			let value = results.val()
			this.setState({
				data : value,
				keterangan : value.keterangan
			})
		})
	}

	getSettings() {
		const settingModel = firebase.database().ref('/settings')
		settingModel.once('value', (settings) => {
			const setting = settings.val()
			this.setState({setting})
		})
	}

	async getUserInfo(id) {
		return new Promise((resolve, reject) => {
			firebase.database().ref('/users').child(id).once('value', (response) => {
				if (response) {
					const value = response.val()
					return resolve(value)
				} else {
					return reject({message : 'User tidak di temukan'})
				}
			})
		})
	}

	actTerima() {
		const {id} = this.props.navigation.state.params
		const collections = firebase.database().ref('/laporan').child(id)
		const {message_progress} = this.state.setting

		collections.once('value', (snap) => {
			let value = snap.val()
			this.getUserInfo(value.user_id).then((user) => {
				if (user) {
					collections.update({
						status : 'proses',
						keterangan : this.state.keterangan
					}, () => {
						RNSms.send(this.state.setting.message_progress + " " + this.state.keterangan, user.phone)
					})
				} else {
					collections.update({
						status : 'gagal',
						keterangan : 'User tidak di temukan'
					})
				}
				// alert(JSON.stringify(user))
			}).catch((e) => {
			})
		})
	}

	componentDidMount() {
		const {params} = this.props.navigation.state
		this.getData(params.id)

		this.getSettings()
	}

	renderMaps() {
		const {data} = this.state
		const {location} = data
		if (location) {
			return (
				<View>
					<MapView
						initialRegion={{latitude : location.latitude, longitude : location.longitude, latitudeDelta : 0.002, longitudeDelta : 0.002}}
						style={{height : 200}}>
						<Marker coordinate={location}/>
					</MapView>

					<RkButton
						style={{marginTop: 10}}
						onPress={() => {
							Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + location.latitude + ',' + location.longitude)
						}}
						rkType="primary small">
						Petunjuk Jalan</RkButton>
				</View>
			)
		} else {
			return (
				<View style={{padding : 10}}>
					<RkText>Lokasi Tidak Tersedia</RkText>
				</View>
			)
		}
	}

	actSelesai() {
		const {id} = this.props.navigation.state.params
		const collections = firebase.database().ref('/laporan').child(id)
		const {message_done} = this.state.setting
		collections.once('value', (snap) => {
			let value = snap.val()
			this.getUserInfo(value.user_id).then((user) => {
				if (user) {
					collections.update({
						status : 'selesai',
						keterangan : this.state.keterangan
					}, () => {
						RNSms.send(this.state.setting.message_done + this.state.keterangan, user.phone)
					})
				} else {
					collections.update({
						status : 'gagal',
						keterangan : 'User tidak di temukan'
					})
				}
				// alert(JSON.stringify(user))
			}).catch((e) => {
			})
		})
	}

	renderBtn() {
		if (this.state.data.status == 'proses') {
			return (
				<RkButton
					onPress={this.actSelesai.bind(this)}
					rkType="success small btnAction">SELESAI</RkButton>
			)
		} else if (this.state.data.status == 'pending') {
			return (
				<RkButton
					onPress={this.actTerima.bind(this)}
					rkType="primary small btnAction">DI PROSES</RkButton>
			)
		}
	}

	playPauseVideo() {
		this.player.seek(0)		
	}

	renderVideo(item) {
		return (
			<View>
				<View
					style={{
						height : 300
					}}>
					<Video
						ref={(ref) => {
							this.player = ref
						}}
						source={{uri : item.assetLink}}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							bottom: 0,
							right: 0,
						}}/>
				</View>
			</View>
		)
	}

	render() {
		const {data} = this.state
		if (data) {
			return (
				<ScrollView>
					<RkCard rkType="article">
						{
							data.type == 'image' ? <Image rkCardImg source={{uri : data.assetLink}}/> : this.renderVideo(data)
						}
	
						<View>
							<View style={{margin: 10}}>
								<RkText style={{marginBottom: 5}} rkType='header4'>{data.judul}</RkText>
								<RkText>{data.status}</RkText>
								<RkText rkType='secondary2 hintColor'>{moment(data.created_at).add(new Date(), 'days').fromNow()}</RkText>
								<RkText rkType='secondary2 hintColor'>{data.alamat}</RkText>
							</View>
						</View>
	
						<View style={{padding : 10}}>
							<RkText rkType='primary3'>{data.diskripsi}</RkText>
						</View>

						{this.renderMaps()}
	
						<RkTextInput
							rkType="rounded"
							value={this.state.keterangan}
							onChangeText={(keterangan) => this.setState({keterangan})}
							placeholder="Keterangan"/>

						<View style={{padding : 10, flexDirection : 'row'}}>
							{this.renderBtn()}
						</View>
					</RkCard>
				</ScrollView>
			);
		} else {
			return (
				<View>
					<RkText>Loading ...</RkText>
				</View>
			)
		}
	}
}
