import React, { Component } from 'react';
import {  View, Text, ScrollView, Dimensions, AsyncStorage, Alert} from 'react-native';
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
		
		this.setState({ location })
	}

	submitLaporan () {
		
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
							rkType="rounded full primary xlarge">KIRIM LAPORAN</RkButton>
					</View>
				</RkCard>
			</ScrollView>
		);
	}
}