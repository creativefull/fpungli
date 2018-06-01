import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, View, Text, } from 'react-native';
import Menu from '../components/menus'
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from 'react-native-firebase';
const ImagePicker = require('react-native-image-picker');
// const path = require('path');

export default class LaporScreen extends Component {
	static navigationOptions = {
		title : 'LAPOR PUNGLI'
	}

	constructor(props) {
		super(props)
	
		this.state = {
			 loading : false
		};

		this.selectVideo = this.selectVideo.bind(this);
	};

	selectVideo () {
		let options = {
			title : 'Pilih Video',
			takePhotoButtonTitle : 'Take Video',
			mediaType : 'video',
			cameraType : 'back',
			storageOptions : {
				skipBackup : true,
			}
		}

		const metadata = {
			contentType: 'video/mp4'
		}

		let filename = Math.floor(Math.random() * 1000000000);

		ImagePicker.showImagePicker(options, (response) => {
			if (!response.didCancel) {
				this.setState({
					loading : true
				})
				let path = response.path;
				firebase.storage()
					.ref("/"+filename)
					.putFile(path, metadata)
					.then(uploadedFile => {
						let downloadURL = uploadedFile.downloadURL;
						// alert(JSON.stringify(uploadedFile));
						AsyncStorage.setItem('dataVideo', downloadURL , (err) => {
							this.setState({
								loading : false
							});
							this.props.navigation.navigate('SaveVideo')
						})
					})
					.catch(e => {
						alert("Error: " + e.message)
					});
			}
		})
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
			icon : <Icon name="play-circle" size={50} color="#0067B0"/>,
			onPress : this.selectVideo.bind(this)
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
