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
import Icon from 'react-native-vector-icons/FontAwesome'

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

export default class ArtikelDetail extends Component {
	static navigationOptions = ({navigation}) => ({
		title : navigation.state.params.title,
		headerLeft : <Icon name="arrow-left" size={24} style={{marginLeft : 10}} color='#FFF' onPress={() => navigation.goBack()}/>
	})

	constructor(props) {
		super(props)

		this.state = {
			data : null
		};
	};
	
	getData(id) {
		firebase.database().ref('/artikel/' + id).on('value', (results) => {
			if (results.val()) {
				this.setState({
					data : results.val()
				})
			}
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
