import React, { Component } from 'react';
import {  View, Text, ScrollView, ToastAndroid} from 'react-native';
import {
	RkCard, RkTextInput, RkText, RkButton
} from 'react-native-ui-kitten'
import firebase from 'react-native-firebase'
const ArtikelDB = firebase.database().ref('/artikel')
import {Color} from '../../config/theme.json'

export default class CreateNews extends Component {
	static navigationOptions = ({navigation}) => ({
		title : 'BUAT ARTIKEL BARU'
	})

	constructor(props) {
	  super(props)
	
	  this.state = {
		judul : '',
		diskripsi : '',
		action : 'tambah'
	  };
	};
	
	componentDidMount() {
		const {params} = this.props.navigation.state
		if (params) {
			if (params.id) {
				this.setState({
					action : 'edit'
				})

				ArtikelDB.child(params.id).once('value', (artikel) => {
					const value = artikel.val()
					if (value) {
						this.setState({
							judul : value.judul,
							diskripsi : value.diskripsi
						})
					} else {
						this.setState({
							action : 'tambah'
						})
					}
				})
			}
		}
	}

	simpanArtikel() {
		const {navigate, goBack} = this.props.navigation
		// TAMBAH
		if (this.state.action == 'tambah') {
			let data = {
				judul : this.state.judul,
				diskripsi : this.state.diskripsi,
				waktu : new Date()
			}
			let newChild = ArtikelDB.push()

			newChild.set(data)
			ToastAndroid.show('Berhasil membuat artikel baru', ToastAndroid.SHORT)
			goBack()
		} else if (this.state.action == 'edit') {
			const {params} = this.props.navigation.state

			let data = {
				judul : this.state.judul,
				diskripsi : this.state.diskripsi
			}

			let newChild = ArtikelDB.child(params.id)

			newChild.update(data)
			ToastAndroid.show('Berhasil edit artikel', ToastAndroid.SHORT)
			goBack()			
		}
	}

	render() {
		return (
			<ScrollView style={{padding : 10}}>
				<RkCard>
					<View rkCardContent>
						<RkText>Judul</RkText>
						<RkTextInput
							style={{borderWidth: 1, borderColor: Color.primary, borderBottomColor: Color.primary, borderRadius: 5}}
							value={this.state.judul}
							onChangeText={(judul) => this.setState({judul})}/>
		
						<RkText>Content</RkText>
						<RkTextInput
							style={{borderWidth: 1, borderColor: Color.primary, borderBottomColor: Color.primary, borderRadius: 5, height : 100}}
							underlineColorAndroid="transparent"
							multiline={true} value={this.state.diskripsi} onChangeText={(diskripsi) => this.setState({diskripsi})}/>
		
						<RkButton
							onPress={this.simpanArtikel.bind(this)}
							rkType="rounded" style={{backgroundColor: Color.primary, width : 200}}>SIMPAN ARTIKEL</RkButton>
					</View>
				</RkCard>
		  </ScrollView>	
		);
	}
}
