import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, View, Text, } from 'react-native';
import Menu from '../components/menus'
import Icon from 'react-native-vector-icons/FontAwesome'
const ImagePicker = require('react-native-image-picker');

export default class LaporScreen extends Component {
	constructor(props) {
		super(props)
	
		this.state = {
			 loading : false
		};
	};
	
	static navigationOptions = {
		title : 'LAPOR PUNGLI'
	}

	selectImage() {
		let options = {
			title : 'Pilih Photo',
			storageOptions : {
				skipBackup : true,
				path : 'images'
			}
		}

		ImagePicker.showImagePicker(options, (response) => {
			if (!response.didCancel) {
				this.setState({
					loading : true
				})
				let data = response.data
				// FETCH API
				fetch('https://api.imgur.com/3/upload', {
					method : 'POST',
					headers : {
						'Authorization' : 'Client-ID 5c628986fba2263',
						'Content-Type' : 'application/json'
					},
					body : JSON.stringify({
						image : data
					})
				}).then((x) => x.json()).then((results) => {					
					AsyncStorage.setItem('dataImage', results.data.link, (err) => {
						this.setState({
							loading : false
						})

						this.props.navigation.navigate('FormLapor')
					})
				}).catch((e) => {
					alert("Error: " + e.message)
				})
			}
		})
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
		let menus = [{
			label : 'FOTO',
			icon : <Icon name="image" size={50} color="#0067B0"/>,
			onPress : this.selectImage.bind(this)
		},{
			label : 'VIDEO',
			icon : <Icon name="play-circle" size={50} color="#0067B0"/>
		}]

		if (this.state.loading) {
			return this.renderLoading()
		} else {
			return (
				<View style={{padding : 10, backgroundColor : '#FFF', flex : 1}}>
					<Menu
						child={menus}/>
				</View>
			);
		}
  }
}
