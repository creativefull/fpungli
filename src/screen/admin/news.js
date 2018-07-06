import React, { Component } from 'react';
import {  View, Text, FlatList, Alert, Image, TouchableOpacity} from 'react-native';

import {
	RkStyleSheet, RkCard, RkText, RkButton, RkTheme
} from 'react-native-ui-kitten'
import {NavigationActions} from 'react-navigation'

import firebase from 'react-native-firebase'
const HistoryDB = firebase.database().ref('/artikel')

import Icon from 'react-native-vector-icons/FontAwesome'
import {Color} from '../../config/theme.json'
import moment from 'moment'
moment.locale('id-ID')

export default class History extends Component {
	static navigationOptions = ({navigation}) => ({
		title : 'MANAGE ARTIKEL',
		headerRight : (
			<RkButton rkType="circle clear small" onPress={() => navigation.navigate('CreateNews')}>
				<Icon name="plus-circle" size={25} color={Color.secondary}/>
			</RkButton>
		)
	})

	constructor(props) {
	  super(props)
	
	  this.state = {
		 data : []
	  };
	};
	
	getData() {
		HistoryDB.orderByChild('waktu').on('value', (value) => {
			let x = []
			value.forEach((v) => {
				let data = v.val()
				let keyOfItem = v.key

				x.push({
					key : keyOfItem,
					judul : data.judul,
					diskripsi : data.diskripsi,
					time : data.waktu
				})
			})

			x = x.reverse()
			this.setState({data : x})
			// alert(JSON.stringify(x))
			// let v = value.val()
			// alert(JSON.stringify(value.toJSON()))
		})
	}

	componentDidMount() {
		this.getData()
	}

	_keyExtractor(post, index) {
		return post.key;
	}

	onDelete(id) {
		Alert.alert('Warning', 'Apakah Anda Yakin Ingin Menghapus Artikel Ini ?', [{
			text : 'TIDAK',
			onPress : null
		}, {
			text : 'YA',
			onPress : () => {
				firebase.database().ref('/artikel/' + id).remove(() => {
					alert('Artikel Berhasil Di Hapus')
				})
			}
		}])
	}

	renderItem(info) {
		return (
			<TouchableOpacity
				onPress={() => this.props.navigation.navigate('CreateNews', {id : info.item.key, title : info.item.judul})}
				onLongPress={() => this.onDelete(info.item.key)}>
				<RkCard
					style={styles.card}>
					<View rkCardContent style={styles.overlay}>
						<View style={{flexWrap : 'wrap', paddingRight : 30, marginRight : 20}}>
							<RkText
								rkType="header4 primary" style={{color : Color.primary}}>{info.item.judul.toUpperCase()}</RkText>

							<RkText
								style={styles.time}
								rkType='secondary2 inverseColor'>{moment(info.item.time).format('DD MMMM YYYY HH:mm:ss')}</RkText>

							<RkText
								rkType="label inverseColor">
								{info.item.diskripsi}
							</RkText>
						</View>
					</View>
				</RkCard>
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<FlatList
				data={this.state.data}
				renderItem={this.renderItem.bind(this)}
				keyExtractor={this._keyExtractor}
				style={styles.container}/>
		);
	}
}

RkTheme.setType('RkText', 'label', {
	fontSize : 12
})

const styles = RkStyleSheet.create(theme => ({
	container : {
		backgroundColor : theme.colors.screen.scroll,
		paddingVertical : 10,
		paddingHorizontal: 10,
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