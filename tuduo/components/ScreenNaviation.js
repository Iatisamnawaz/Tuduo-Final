import { Text, View } from 'react-native';
import React, { Component, useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AssistScreen from './AssistScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './ProfileScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import OurHome from './OurHome';
import TodoHome from './TodoHome';
import { auth, db } from '../database/Firebase';

const Tab = createBottomTabNavigator();

function ScreenNavigation() {
	const [ connectedUserId, setConnectedUserId ] = useState(null);

	// Step 1: Retrieve the connected user's ID
	useEffect(() => {
		const fetchConnectedUser = async () => {
			const userId = auth.currentUser.uid;

			try {
				// First query: where the user is user1
				const query1 = db
					.collection('relationships')
					.where('user1', '==', userId)
					.where('status', '==', 'connected'); // Adjust the status as needed

				// Second query: where the user is user2
				const query2 = db
					.collection('relationships')
					.where('user2', '==', userId)
					.where('status', '==', 'connected');

				// Execute both queries and combine the results
				const [ snapshot1, snapshot2 ] = await Promise.all([ query1.get(), query2.get() ]);

				let connectedUserId = null;

				snapshot1.forEach((doc) => {
					const data = doc.data();
					connectedUserId = data.user2; // If user1 is current user, then user2 is connected user
				});

				snapshot2.forEach((doc) => {
					const data = doc.data();
					connectedUserId = data.user1; // If user2 is current user, then user1 is connected user
				});

				setConnectedUserId(connectedUserId);
			} catch (error) {
				console.error('Error fetching connected user: ', error);
			}
		};

		fetchConnectedUser();
	}, []);

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					if (route.name === 'home') {
						iconName = focused ? 'home' : 'home-outline';
					} else if (route.name === 'Chat') {
						iconName = focused ? 'chat' : 'chat-outline';
					} else if (route.name === 'Assist') {
						iconName = focused ? 'robot-love' : 'robot-love-outline';
					} else if (route.name === 'Profile') {
						iconName = focused ? 'account' : 'account-outline';
					} else if (route.name === 'Couple') {
						iconName = focused ? 'account-heart' : 'account-heart-outline';
					}
					return <MaterialCommunityIcons name={iconName} size={24} color="#5B3918" />;
				},
				tabBarActiveTintColor: 'tomato',
				tabBarInactiveTintColor: 'gray',
				tabBarStyle: [
					{
						display: 'flex',
						backgroundColor: '#FFEFCD'
					},
					null
				],
				headerStyle: {
					backgroundColor: '#FFEFCD'
				},
				headerTintColor: '#5B3918',
				headerTitleStyle: {
					fontWeight: 'bold'
				}
			})}
		>
			<Tab.Screen name="home" component={TodoHome} />
			<Tab.Screen name="Couple" children={() => <OurHome connectedUserId={connectedUserId} />} />
			<Tab.Screen name="Chat" component={ChatScreen} />
			<Tab.Screen name="Assist" component={AssistScreen} />
			<Tab.Screen name="Profile" component={ProfileScreen} />
		</Tab.Navigator>
	);
}

export default ScreenNavigation;
