import React, { Component } from 'react';
import {  View, Text, Alert} from 'react-native';
import Config from '../config/app.json'
import {Color} from '../config/theme.json'

import { StackNavigator, TabNavigator } from "react-navigation";
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
				<RkText rkType="primary" style={{color : '#FFF'}}>Logout</RkText>
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
		return (
			<View style={styles.container}>
				<RkText>This is article</RkText>
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
import AccountPage from './account'

const HomePage = TabNavigator({
	HomeApp : {
		screen : HomeApp,
		navigationOptions : {
			tabBarIcon : <Icon name="home" size={20} color={Color.secondary} />
		}
	},
	LaporScreen : {
		screen : LaporScreen,
		navigationOptions : {
			tabBarIcon : <Icon name="camera" size={20} color={Color.secondary} />
		}
	},
	History : {
		screen : History,
		navigationOptions : {
			tabBarIcon : <Icon name="align-right" size={20} color={Color.secondary} />
		}
	},
	AccountPage : {
		screen : AccountPage,
		navigationOptions : {
			tabBarIcon : <Icon name="user" size={20} color={Color.secondary} />
		}
	}
}, {
	initialRouteName : 'HomeApp',
	tabBarOptions : {
		style : {
			backgroundColor : Color.primary
		},
		showLabel : false,
		showIcon : true
	},
	swipeEnabled : false
})

export default StackNavigator({
	HomePage : {
		screen : HomePage,
		navigationOptions : {
			headerStyle : {
				backgroundColor : Color.primary
			},
			headerTitleStyle : {
				color : '#FFF'
			}
		}
	}
})