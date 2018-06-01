import React, { Component } from 'react';
import {  View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import {
	RkText,
	RkCard,
	RkStyleSheet,
	RkTheme,
	RkButton
} from 'react-native-ui-kitten'
import firebase from 'react-native-firebase';
import MapView, { Marker } from 'react-native-maps';

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
		title : navigation.state.params.title
	})

	constructor(props) {
		super(props)

		this.state = {
			data : null
		};
	};
	
	getData(id) {
		firebase.database().ref('/laporan/' + id).on('value', (results) => {
			this.setState({
				data : results.val()
			})
		})
	}

	actTerima() {
		const {id} = this.props.navigation.state.params
		const collections = firebase.database().ref('/laporan').child(id)
		collections.update({
			status : 'proses'
		})
	}

	componentDidMount() {
		const {params} = this.props.navigation.state
		this.getData(params.id)
	}

	renderMaps() {
		const {data} = this.state
		const {location} = data
		if (location) {
			return (
				<MapView
					initialRegion={{latitude : location.latitude, longitude : location.longitude, latitudeDelta : 0.002, longitudeDelta : 0.002}}
					style={{height : 200}}>
					<Marker coordinate={location}/>
				</MapView>
			)	
		} else {
			return (
				<View style={{padding : 10}}>
					<RkText>Lokasi Tidak Tersedia</RkText>
				</View>
			)
		}
	}

	renderBtn() {
		if (this.state.data.status == 'proses') {
			return (
				<RkButton
					onPress={this.actTerima.bind(this)}
					rkType="success small btnAction">SELESAI</RkButton>
			)
		} else {
			return (
				<RkButton
					onPress={this.actTerima.bind(this)}
					rkType="primary small btnAction">DI PROSES</RkButton>
			)
		}
	}

	render() {
		const {data} = this.state
		if (data) {
			return (
				<ScrollView>
					<RkCard rkType="article">
						<Image rkCardImg source={{uri : data.assetLink}}/>
	
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
	
						<View style={{padding : 10, flexDirection : 'row'}}>
							{this.renderBtn()}
							<RkButton
								rkType="danger small btnAction">DITERIMA</RkButton>
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
