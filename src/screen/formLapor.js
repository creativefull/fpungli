import React, { Component } from 'react';
import {  View, Text, ScrollView, Dimensions, AsyncStorage} from 'react-native';
import {
	RkCard, RkTextInput, RkText, RkButton
} from 'react-native-ui-kitten'

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
		 }
	  };
	};
	
	async getContentSaved() {
		const xlocation = await AsyncStorage.getItem('location')
		const location = JSON.parse(xlocation)

		const assetLink = await AsyncStorage.getItem('dataImage')
		this.setState({ location, assetLink })
	}

	componentDidMount() {
		this.getContentSaved()
	}

	render() {
		return (
			<ScrollView style={{padding : 10}}>
				<RkCard>
					<View rkCardContent>
						<RkText>Alamat Lengkap / Lokasi</RkText>
						<RkText>{JSON.stringify(this.state)}</RkText>
						<RkTextInput rkType="rounded"/>
		
						<RkText>Diskripsi</RkText>
						<RkTextInput multiline={true} style={{height : 100, borderWidth: 1,borderColor: '#CCC', borderRadius: 20,}}/>

						<RkButton
							rkType="rounded full primary xlarge">KIRIM LAPORAN</RkButton>
					</View>
				</RkCard>
			</ScrollView>
		);
	}
}
