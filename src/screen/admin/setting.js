import React, { Component } from 'react';
import {  View, Text, ScrollView, ToastAndroid} from 'react-native';
import {
	RkCard, RkTextInput, RkText, RkButton
} from 'react-native-ui-kitten'
import firebase from 'react-native-firebase'
const SettingDB = firebase.database().ref('/settings')

export default class SettingPage extends Component {
	static navigationOptions = {
		title : 'Setting Application'
	}
	constructor(props) {
	  super(props)
	
	  this.state = {
		message_progress : '',
		message_done : ''
	  };

	  this.unsubscriber = null
	};
	
	getInfoAkun() {
		SettingDB.once('value', (value) => {
			const pData = value.val()
			this.setState({
				message_progress : pData.message_progress,
				message_done : pData.message_done
			})
		})
	}

	simpanAkun() {
		let data = {
			message_progress : this.state.message_progress,
			message_done : this.state.message_done
		}
		SettingDB.update(data)
		ToastAndroid.show('Berhasil Menyimpan Settingan', ToastAndroid.SHORT)
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
				<RkText>Pesan Notifikasi Tindak Lanjutin</RkText>
				<RkTextInput
					rkType="rounded"
					value={this.state.message_progress}
					onChangeText={(message_progress) => this.setState({message_progress})}/>
				<RkText>Pesan Notifikasi Selesai</RkText>
	
				<RkTextInput
					rkType="rounded"
					value={this.state.message_done}
					onChangeText={(message_done) => this.setState({message_done})}/>

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
