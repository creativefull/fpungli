import React, { Component } from 'react';
import {  View, Text, FlatList, Alert, ToastAndroid} from 'react-native';
import {
	RkStyleSheet, RkCard, RkText, RkButton, RkTheme
} from 'react-native-ui-kitten'
import firebase from 'react-native-firebase'
const HistoryDB = firebase.database().ref('/users')
import {Color} from '../../config/theme.json'

export default class ManageUser extends Component {
	static navigationOptions = ({navigation}) => ({
		title : "Manage User",
		headerRight : (
			<RkButton rkType="circle clear small" onPress={() => navigation.navigate('TambahUser')}>
				<RkText rkType="primary" style={{color : Color.secondary}}>Tambah</RkText>
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
					nama : data.name,
					role : data.role_group,
					email : data.email,
					phone : data.phone
				})
			})

			this.setState({data : x})
		})
	}

	componentDidMount() {
		this.getData()
	}

	_keyExtractor(post, index) {
		return post.key;
	}

	editBtn(params) {
		const {navigate} = this.props.navigation
		navigate('ManageUserEdit', params)
	}

	confirmDelete(id) {
		Alert.alert('Warning', 'Apakah anda yakin ingin menghapus user ini ?', [{
			text : 'TIDAK',
			onPress : () => {}
		}, {
			text : 'YA',
			onPress : () => {
				HistoryDB.child(id).remove()
				ToastAndroid.show('Berhasil Menghapus User', ToastAndroid.SHORT)
			}
		}])
	}

	renderItem(info) {
		const {item} = info
		return (
			<RkCard
				rkType="default"
				style={styles.card}>				
				<View rkCardContent style={styles.overlay}>
					<View style={{flexWrap : 'wrap', paddingRight : 30, marginRight : 20}}>
						<RkText
							rkType="header4 inverseColor">{info.item.nama.toUpperCase()}</RkText>
						<RkText
							style={styles.time}
							rkType='secondary2 inverseColor'>{info.item.role}</RkText>

						<RkText
							rkType="header4 inverseColor">{'Email : ' + item.email}</RkText>
						<RkText
							rkType="header4 inverseColor">{'Nomor Hp : ' + item.phone}</RkText>

						<View style={{flexDirection : 'row', marginTop : 10}}>
							<RkButton
								onPress={() => this.confirmDelete(item.key)}
								rkType="small danger customBtn">Hapus</RkButton>

							<RkButton
								onPress={() => {
									this.editBtn(item)
								}}
								rkType="small primary customBtn">Edit</RkButton>
						</View>
					</View>
				</View>
			</RkCard>
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

RkTheme.setType('RkButton', 'customBtn', {
	paddingTop : 2,
	paddingBottom: 2,
	marginRight : 10
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
		// marginVertical: 10,
		marginBottom: 5,
		marginTop : 5
	},
	time : {
		fontSize: 10,
		color : '#089'
	}
}))