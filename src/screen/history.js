import React, { Component } from 'react';
import {  View, Text, FlatList, Image} from 'react-native';

import {
	RkStyleSheet, RkCard, RkText, RkButton, RkTheme
} from 'react-native-ui-kitten'

import Icon from 'react-native-vector-icons/FontAwesome'

export default class History extends Component {
	static navigationOptions = {
		title : 'HISTORY'
	}
	constructor(props) {
	  super(props)
	
	  this.state = {
		 data : [{
			key : '1',
			judul : 'Pungli Ambil Uang Jajan Anak Anak',
			image : 'https://cdn.pixabay.com/photo/2017/07/11/19/15/landscape-2494720_960_720.jpg',
			time : '2018-09-03',
			type : 'image'
		},{
			key : '1',
			judul : 'Pungli Ambil Uang Jajan Anak Anak',
			image : 'https://cdn.pixabay.com/photo/2017/07/11/19/15/landscape-2494720_960_720.jpg',
			time : '2018-09-03'
		}]
	  };
	};
	
	_keyExtractor(post, index) {
		return post.key;
	}

	renderItem(info) {
		return (
			<RkCard
				rkType="imgBlock"
				style={styles.card}>
				<Image
					rkCardImg
					source={{ uri : info.item.image}}/>
				
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
							Di Terima
						</RkText>
					</View>
				</View>
			</RkCard>
		)
	}

	render() {
		return (
			<FlatList
				data={this.state.data}
				renderItem={this.renderItem}
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