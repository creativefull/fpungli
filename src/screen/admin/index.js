import React, { Component } from 'react';
import {  View, Text, Alert} from 'react-native';
import Config from '../../config/app.json'
import { StackNavigator } from "react-navigation";
import { RkButton, RkText } from 'react-native-ui-kitten';
import Firebase from 'react-native-firebase';
import {
	RkStyleSheet
} from 'react-native-ui-kitten'
import Icon from 'react-native-vector-icons/FontAwesome'

// COMPONENTS
import Menu from '../../components/menus'

class HomeApp extends Component {
	static navigationOptions = ({navigation}) => ({
		title : "ADMINISTRATOR",
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
			label : 'LAPORAN PUNGLI',
			icon : (<Icon name="align-right" size={50} color="#0067B0" />),
			onPress : () => this.pindahMenu('LaporScreen')
		},{
			label : 'ARTIKEL',
			icon : (<Icon name="pencil" size={50} color="#0067B0" />),
			onPress : () => this.pindahMenu('News')
		},{
			label : 'MANAGE USER',
			icon : (<Icon name="user" size={50} color="#0067B0" />),
			onPress : () => this.pindahMenu('ManageUser')
		},{
			label : 'SETTINGS',
			icon : (<Icon name="gear" size={50} color="#0067B0" />)
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

import LaporScreen from './laporan'
import LaporanDetail from './laporan_detail';
import News from './news';
import CreateNews from './create-news';
import ManageUser from './manage_user';
import ManageUserEdit from './edit-user';

export default StackNavigator({
	HomeApp : {
		screen : HomeApp
	},
	LaporScreen : {
		screen : LaporScreen
	},
	LaporanDetail : {
		screen : LaporanDetail
	},
	News : {
		screen : News
	},
	CreateNews : {
		screen : CreateNews
	},
	ManageUser : {
		screen : ManageUser
	},
	ManageUserEdit : {
		screen : ManageUserEdit
	}
}, {
	initialRouteName : 'ManageUser'
})