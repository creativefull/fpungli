import React, { Component } from 'react';
import {  View, Text, StyleSheet, Dimensions, AsyncStorage} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {
	RkButton
} from 'react-native-ui-kitten'

const {width, height} = Dimensions.get('screen')

export default class MapLocation extends Component {
	static navigationOptions = {
		title : 'Pilih Lokasi'
	}
	constructor(props) {
	  super(props)
	
	  this.state = {
		 location : {
			 latitude : 0,
			 longitude : 0
		 },
		 loading : true
	  };
	};
	
	getMylocation() {
		// Geolocation.requestAuthorization()
		navigator.geolocation.watchPosition(({coords}) => {
			const {latitude, longitude} = coords
			let location = {
				latitude : latitude,
				longitude : longitude
			}
			// alert(JSON.stringify(location))
			let loading = false
			this.setState({location, loading})
		}, (error) => alert(JSON.stringify(error)))
	}

	renderMarker() {
		return (
			<Marker coordinate={this.state.location}>
			</Marker>
		)
	}

	componentDidMount() {
		this.getMylocation()
	}

	saveLocation() {
		let data = JSON.stringify(this.state.location)
		AsyncStorage.setItem('location', data, () => {
			this.props.navigation.navigate('LaporScreen')
		})
	}

	render() {
	return (
	  <View style={styles.container}>
	  	<View
			style={{position : 'absolute', flex : 1, bottom : 10, left : 10, right : 10, justifyContent : 'center', zIndex : 99}}>
			<RkButton rkType="default full" style={{width : width}} onPress={this.saveLocation.bind(this)}>SELANJUTNYA</RkButton>
		</View>
		<MapView
			region={{
				latitude: this.state.location.latitude,
				longitude: this.state.location.longitude,
				latitudeDelta: 0.0022,
				longitudeDelta: 0.0021,
			}}
			followsUserLocation={true}
			showsMyLocationButton={true}
			showsUserLocation={true}
			style={styles.map}>
			{this.renderMarker()}
		</MapView>
	  </View>
	);
  }
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'stretch',
		backgroundColor: 'gray',
	},
	map : {
		...StyleSheet.absoluteFillObject,
		zIndex : -1
	}
})