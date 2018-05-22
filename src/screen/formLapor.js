import React, { Component } from 'react';
import {  View, Text, ScrollView, Dimensions} from 'react-native';
import {
	RkCard, RkTextInput, RkText, RkButton
} from 'react-native-ui-kitten'

const {width, height} = Dimensions.get('screen')

export default class FormLapor extends Component {
	static navigationOptions = {
		title : 'Input Data'
	}

	render() {
		return (
			<ScrollView style={{padding : 10}}>
				<RkCard>
					<View rkCardContent>
						<RkText>Alamat Lengkap / Lokasi</RkText>
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
