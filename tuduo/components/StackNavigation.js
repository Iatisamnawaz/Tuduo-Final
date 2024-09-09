import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Login from './login';
import Register from './register';
import home from './Home';
import ChatBot from './ChatBot';
import SearchUser from './SearchUser';
import Requests from './Requests';
const Stack = createStackNavigator();
// Setting up stack navigation
const StackNav = () => {
	return (
		<Stack.Navigator
			initialRouteName="Login"
			screenOptions={{
				headerStyle: { elevation: 0 },
				cardStyle: { backgroundColor: 'red' }
			}}
		>
			<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
			<Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
			<Stack.Screen name="Home" component={home} options={{ headerShown: false }} />
			<Stack.Screen name="ChatBot" component={ChatBot} options={{ headerShown: false }} />
			<Stack.Screen name="SearchUser" component={SearchUser} options={{ headerShown: false }} />
			<Stack.Screen name="Requests" component={Requests} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
};

const Screen = () => {
	return (
		<NavigationContainer>
			<StackNav />
		</NavigationContainer>
	);
};
export default Screen;
