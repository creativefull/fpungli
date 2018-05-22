import React, { Component } from 'react';

import {
	StackNavigator
} from 'react-navigation';

import Splash from './screen/splash';
import Signup from './screen/signup';
import Home from './screen/home'

const AppHome = StackNavigator({
	Home : {
		screen : Home
	}
}, {
	initialRouteName : 'Home'
})

const App = StackNavigator({
	Signup : {
		screen : Signup
	},
	Splash : {
		screen : Splash
	}
}, {
	initialRouteName : 'Splash'
})
export default App