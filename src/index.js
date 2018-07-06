import React, { Component } from 'react';

import {
	StackNavigator
} from 'react-navigation';

import Splash from './screen/splash';
import Signup from './screen/signup';
import Home from './screen/home'
import ResetPassword from './screen/forgotpassword'

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
	ResetPassword : {
		screen : ResetPassword
	},
	Splash : {
		screen : Splash
	}
}, {
	initialRouteName : 'Splash'
})
export default App