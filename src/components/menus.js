import React, { Component } from 'react';
import {
	ScrollView,
	View,
	Dimensions
} from 'react-native';
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons'

import {
	RkStyleSheet, RkButton, RkText, RkTheme
} from 'react-native-ui-kitten'

class MenuComponent extends Component {
	static propTypes = {
		child : PropTypes.arrayOf(
			PropTypes.shape({
				icon : PropTypes.element.isRequired,
				label : PropTypes.string.isRequired,
				onPress : PropTypes.func
			})
		).isRequired
	}

	constructor(props) {
		super(props)

		this.state = {
			dimension : undefined
		}
	};
	
	onLayout() {
		let dimension = Dimensions.get('screen')
		this.setState({dimension})
	}

	componentDidMount() {
		this.onLayout()
	}

	renderMenu() {
		let items = <View/>;
		if (this.state.dimension) {
			let size = this.state.dimension.width / 2;
			items = this.props.child.map((route, index) => {
				return (
					<RkButton
						rkType="clear btn-bordered"
						style={{width : size-20, height : size, margin : 5}}
						key={index}
						onPress={route.onPress}>
						<RkText
							style={styles.icon} rkType="primary moon xxlarge">
							{route.icon}
						</RkText>
						<RkText
							rkType="small btn-label">
							{route.label}
						</RkText>
					</RkButton>
				)
			})
		}
		return items;
	}

	render() {
		return (
			<ScrollView
				style={styles.rootComponent}
				onLayout={this.onLayout.bind(this)}
				contentContainerStyle={styles.rootContainer}>
				{this.renderMenu()}
			</ScrollView>
		);
	}
}

RkTheme.setType('RkButton', 'btn-bordered', {
	borderWidth: 1,
	borderColor: '#0067B0',
	flexDirection : 'column'
})
RkTheme.setType('RkText', 'btn-label', {
	color : '#666',
	fontWeight: 'bold',
	fontSize: 15,
})

const styles = RkStyleSheet.create(theme => ({
	rootComponent : {
		backgroundColor: theme.colors.screen.base
	},
	rootContainer : {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	icon : {
		marginBottom: 15,
	}
}))

export default MenuComponent