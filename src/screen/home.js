import React, { Component } from 'react';
import {  View, Text, Alert, Dimensions, ScrollView} from 'react-native';
import Config from '../config/app.json'
import {Color} from '../config/theme.json'

import { StackNavigator, TabNavigator } from "react-navigation";
import { RkButton, RkText, RkCard } from 'react-native-ui-kitten';
import Firebase from 'react-native-firebase';
const moment = require('moment')
moment.locale('id')
const DBArtikel = Firebase.database().ref('/artikel')

import {
	RkStyleSheet
} from 'react-native-ui-kitten'
import Icon from 'react-native-vector-icons/FontAwesome'

// COMPONENTS
import Menu from '../components/menus'
const {width, height} = Dimensions.get('screen')

class HomeApp extends Component {
	static navigationOptions = ({navigation}) => ({
		title : Config.name.toUpperCase(),
		headerRight : (
			<RkButton rkType="circle clear small" onPress={() => navigation.state.params.handleLogout()}>
				<RkText rkType="primary" style={{color : '#FFF'}}>Logout</RkText>
			</RkButton>
		)
	})

	constructor(props) {
	  super(props)
	
	  this.state = {
		 artikel : []
	  };
	};
	

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
				this.props.navigation.navigate('Splash')				
			}
		}])
	}

	getListArtikel() {
		DBArtikel.on('value', (result) => {
			let artikel = []
			result.forEach((v, key) => {
				const value = v.val()
				let keyOfItem = v.key
				artikel.push({
					key : keyOfItem,
					judul : value.judul,
					diskripsi : value.diskripsi,
					waktu : value.waktu
				})
			})

			this.setState({artikel})
		})
	}

	componentDidMount() {
		this.props.navigation.setParams({handleLogout : this.onLogout.bind(this)})
		this.getListArtikel()
	}
	
	pindahMenu(uri, params = {}) {
		this.props.navigation.navigate(uri, params)
	}
	
	articlePage() {
		return (
			<View>
				{
					this.state.artikel.map((artikel, key) => {
						return (
							<RkCard
								style={styles.card}
								key={key}>
								<View rkCardContent style={styles.overlay}>
									<View style={{flexWrap : 'wrap', paddingRight : 30, marginRight : 20}}>
										<RkText
											rkType="header4" style={{color : Color.primary}}>{artikel.judul}</RkText>
										<RkText
											style={styles.time}
											rkType='secondary2 inverseColor'>{moment(artikel.waktu).add(new Date(), 'days').fromNow()}</RkText>

										<RkText
											rkType="label inverseColor">
											{artikel.diskripsi}
										</RkText>
									</View>
								</View>
							</RkCard>
						)
					})
				}
			</View>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<ScrollView>
					{this.articlePage()}

				</ScrollView>
				<View
					style={{position : 'absolute', flex : 1, bottom : 10, left : 10, right : 10, justifyContent : 'center', zIndex : 99}}>
					<RkButton rkType="default full" style={{width : width, backgroundColor : Color.primary}} onPress={() => this.props.navigation.navigate('LaporScreen')}>LAPORKAN PUNGLI</RkButton>
				</View>
			</View>
		);
	}
}

const styles = RkStyleSheet.create(theme => ({
	container : {
		backgroundColor: theme.colors.screen.base,
		padding: 10,
		flex : 1
	},
	overlay : {
		flexDirection: 'row',
	},
	card : {
		marginVertical: 10
	},
	time : {
		fontSize: 10,
		color : '#999'
	}	
}))

import LaporScreen from './lapor_screen'
import History from './history'
import MapLocation from './maps_location'
import FormLapor from './formLapor'
import AccountPage from './account';

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