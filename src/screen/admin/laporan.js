import React, { Component } from 'react';
import {  View, Text, FlatList, Image, TouchableOpacity, Alert} from 'react-native';

import {
	RkStyleSheet, RkCard, RkText, RkButton, RkTheme
} from 'react-native-ui-kitten'
import {NavigationActions} from 'react-navigation'

import firebase from 'react-native-firebase'
const HistoryDB = firebase.database().ref('/laporan')

import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
moment.locale('ID')

import Video from 'react-native-video'

export default class History extends Component {
	static navigationOptions = {
		title : 'LAPORAN PUNGLI'
	}
	constructor(props) {
	  super(props)
	
	  this.state = {
		 data : []
	  };
	};
	
	getData() {
		HistoryDB.on('value', (value) => {
			let x = []
			value.forEach((v) => {
				let data = v.val()
				let keyOfItem = v.key

				x.push({
					key : keyOfItem,
					judul : data.judul,
					assetLink : data.assetLink,
					type : data.type,
					time : data.created_at,
					status : data.status
				})
			})

			x = x.reverse()
			this.setState({data : x})
			// alert(JSON.stringify(x))
			// let v = value.val()
			// alert(JSON.stringify(value.toJSON()))
		})
	}

	onDelete(id) {
		Alert.alert('Warning', 'Apakah Anda Yakin Ingin Menghapus Laporan Ini ?', [{
			text : 'TIDAK',
			onPress : null
		}, {
			text : 'YA',
			onPress : () => {
				firebase.database().ref('/laporan/' + id).remove(() => {
					alert('Laporan Berhasil Di Hapus')
				})
			}
		}])
	}	

	componentDidMount() {
		this.getData()
	}

	_keyExtractor(post, index) {
		return post.key;
	}

	renderItem(info) {
		return (
			<TouchableOpacity
				onPress={() => this.props.navigation.navigate('LaporanDetail', {id : info.item.key, title : info.item.judul})}
				onLongPress={() => this.onDelete(info.item.key)}>
				<RkCard
					rkType="imgBlock"
					style={styles.card}>
					{/* <Image
						rkCardImg
						source={{ uri : info.item.assetLink}}/> */}
					
					<View rkCardContent style={styles.overlay}>
						<View style={{paddingRight : 10}}>
							{
								info.item.type == 'image' ? (
									<Icon
										name={'image'}
										size={50}/>
								) : (
									<Icon
										name={'play-circle'}
										size={50}/>
								)
							}
						</View>
						<View style={{flexWrap : 'wrap', paddingRight : 30, marginRight : 20}}>
							<RkText
								rkType="header4 inverseColor">{info.item.judul.toUpperCase()}</RkText>
							<RkText
								style={styles.time}
								rkType='secondary2 inverseColor'>{moment(info.item.time).format('DD MMMM YYYY HH:mm:ss')}</RkText>

							<RkText
								rkType="label primary">
								{info.item.status}
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