import React, { Component } from 'react';
import {  View, Text, Alert} from 'react-native';
import Config from '../config/app.json'
import { StackNavigator } from "react-navigation";
import { RkButton, RkText } from 'react-native-ui-kitten';
import Firebase from 'react-native-firebase';
import {
	RkStyleSheet
} from 'react-native-ui-kitten'
import Icon from 'react-native-vector-icons/FontAwesome'

// COMPONENTS
import Menu from '../components/menus'

class HomeApp extends Component {
	static navigationOptions = ({navigation}) => ({
		title : Config.name.toUpperCase(),
		headerRight : (
			<RkButton rkType="circle clear small" onPress={() => navigation.state.params.handleLogout()}>
				<RkText rkType="primary">Logout</RkText>
			</RkButton>
		)
	})

	onLogout() {
		Alert.alert('Warning', 'Apakah Yakin Ingin Keluar ?', [{
			text : 'TIDAK',
			onPress : () => {}
		}, {
			text : 'YA, KELUAR',
			onPress : () => {
				Firebase.auth().signOut().then(() => {
					this.props.navigation.navigate('Splash')
				}).catch((e) => {
					Alert.alert('Error', e.message)
				})
			}
		}])
	}

	componentDidMount() {
		this.props.navigation.setParams({handleLogout : this.onLogout.bind(this)})
	}
	
	pindahMenu(uri, params = {}) {
		this.props.navigation.navigate(uri, params)
	}

	render() {
		let dataMenu = [{
			label : 'LAPOR PUNGLI',
			icon : (<Icon name="camera" size={50} color="#0067B0" />),
			onPress : () => this.pindahMenu('MapLocation')
		},{
			label : 'HISTORY',
			icon : (<Icon name="align-right" size={50} color="#0067B0" />),
			onPress : () => this.pindahMenu('History')
		},{
			label : 'AKUN SAYA',
			icon : (<Icon name="user" size={50} color="#0067B0" />),
			onPress : () => this.pindahMenu('AccountPage')
		},{
			label : 'ABOUT',
			icon : (<Icon name="warning" size={50} color="#0067B0" />)
		}]
		return (
			<View style={styles.container}>
				<Menu
					child={dataMenu}/>
			</View>
		);
	}
}

const styles = RkStyleSheet.create(theme => ({
	container : {
		backgroundColor: theme.colors.screen.base,
		padding: 10,
		flex : 1
	}
}))

import LaporScreen from './lapor_screen'
import History from './history'
import MapLocation from './maps_location'
import FormLapor from './formLapor'
import AccountPage from './account';
import SaveVideo from './saveVideo';

export default StackNavigator({
	HomeApp : {
		screen : HomeApp
	},
	LaporScreen : {
		screen : LaporScreen
	},
	FormLapor : {
		screen : FormLapor
	},
	SaveVideo : {
		screen : SaveVideo
	},
	History : {
		screen : History
	},
	MapLocation : {
		screen : MapLocation
	},
	AccountPage : {
		screen : AccountPage
	}
}, {
	initialRouteName : 'HomeApp'
})