import React, { Component } from 'react';
import {  View, Text, FlatList, Image, TouchableOpacity} from 'react-native';

import {
	RkStyleSheet, RkCard, RkText, RkButton, RkTheme
} from 'react-native-ui-kitten'
import {NavigationActions} from 'react-navigation'

import firebase from 'react-native-firebase'
const HistoryDB = firebase.database().ref('/laporan')

import Icon from 'react-native-vector-icons/FontAwesome'

export default class History extends Component {
	static navigationOptions = ({navigation}) => ({
		title : 'MANAGE ARTIKEL',
		headerRight : (
			<RkButton rkType="circle clear small" onPress={() => navigation.navigate('CreateNews')}>
				<Icon name="plus-circle" size={25}/>
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
		HistoryDB.on('value', (value) => {
			let x = []
			value.forEach((v) => {
				let data = v.val()
				let keyOfItem = v.key

				x.push({
					key : keyOfItem,
					judul : data.judul,
					assetLink : data.assetLink,
					type : 'image',
					time : data.created_at,
					status : data.status
				})
			})

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

	renderItem(info) {
		return (
			<TouchableOpacity onPress={() => this.props.navigation.navigate('LaporanDetail', {id : info.item.key, title : info.item.judul})}>
				<RkCard
					rkType="imgBlock"
					style={styles.card}>
					{/* <Image
						rkCardImg
						source={{ uri : info.item.assetLink}}/> */}
					
					<View rkCardContent style={styles.overlay}>
						<View style={{paddingRight : 10}}>
							<Icon
								name={info.item.type == 'image' ? 'image' : 'play-circle'}
								size={50}/>
						</View>
						<View style={{flexWrap : 'wrap', paddingRight : 30, marginRight : 20}}>
							<RkText
								rkType="header4 inverseColor">{info.item.judul.toUpperCase()}</RkText>
							<RkText
								style={styles.time}
								rkType='secondary2 inverseColor'>{info.item.time}</RkText>

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