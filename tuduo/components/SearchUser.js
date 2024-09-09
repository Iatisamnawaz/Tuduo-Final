import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, db } from '../database/Firebase';

const SearchUser = () => {
	const [ searchQuery, setSearchQuery ] = useState('');
	const [ users, setUsers ] = useState([]);
	const [ requestedUsers, setRequestedUsers ] = useState({}); // Track requested users

	useEffect(
		() => {
			if (searchQuery && auth.currentUser) {
				const fetchUsers = async () => {
					const result = await searchUsers(searchQuery);
					setUsers(result);
				};
				fetchUsers();
			} else {
				setUsers([]);
			}
		},
		[ searchQuery ]
	);

	const searchUsers = async (searchText) => {
		try {
			const querySnapshot = await db
				.collection('users')
				.where('username', '>=', searchText)
				.where('username', '<=', searchText + '\uf8ff') // This handles partial matches
				.get();

			const users = [];
			querySnapshot.forEach((doc) => {
				users.push({ id: doc.id, ...doc.data() });
			});

			return users;
		} catch (error) {
			console.error('Error searching users: ', error);
			alert(`Error searching users: ${error.message}`);
		}
	};

	const sendConnectionRequest = async (recipientUserId) => {
		try {
			const currentUserId = auth.currentUser.uid;

			// Add a request to the recipient's 'relationships' collection
			await db.collection('relationships').add({
				user1: currentUserId,
				user2: recipientUserId,
				status: 'pending'
				// createdAt: db.FieldValue.serverTimestamp() // Store the creation time
			});

			console.log('Request sent successfully!');

			// Update the requestedUsers state
			setRequestedUsers((prevRequestedUsers) => ({
				...prevRequestedUsers,
				[recipientUserId]: true // Mark this user as requested
			}));

			return true;
		} catch (error) {
			console.error('Error sending request: ', error);
			alert(`Error sending request: ${error.message}`);
			return false;
		}
	};

	const renderAppointmentCard = ({ item }) => (
		<View style={[ styles.card ]} className="bg-themeEight border-y-4 border-t-4 border-themeFour">
			<Text style={[ styles.cardTitle ]} className="text-white">
				{item.username}
			</Text>
			<View style={styles.cardDates}>
				<Text className="text-white">{item.email}</Text>
			</View>
			<View style={styles.cardContent}>
				<View style={styles.buttonsContainer}>
					<TouchableOpacity
						style={styles.actionButton}
						className="bg-themeNine"
						onPress={() => sendConnectionRequest(item.id)}
						disabled={requestedUsers[item.id]} // Disable button after request is sent
					>
						<Text style={styles.buttonText}>{requestedUsers[item.id] ? 'Requested' : 'Request'}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Search User</Text>
			<TextInput
				style={styles.searchInput}
				placeholder="Search..."
				value={searchQuery}
				onChangeText={setSearchQuery}
			/>
			<FlatList
				contentContainerStyle={styles.listContainer}
				data={users}
				renderItem={renderAppointmentCard}
				keyExtractor={(item) => item.id}
				numColumns={2}
			/>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		paddingTop: 60,
		backgroundColor: '#FFEFCD'
	},
	listContainer: {
		paddingHorizontal: 5
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	searchInput: {
		height: 40,
		borderWidth: 2,
		borderRadius: 5,
		borderColor: '#A9A9A9',
		marginBottom: 10,
		paddingHorizontal: 10
	},
	card: {
		flex: 1,
		marginBottom: 20,
		padding: 10,
		borderRadius: 5,
		marginHorizontal: 10,
		borderRadius: 8,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		paddingVertical: 5
	},
	cardDates: {
		flexDirection: 'row',
		paddingVertical: 5
	},
	cardContent: {
		justifyContent: 'space-between',
		paddingTop: 10
	},
	buttonsContainer: {
		flexDirection: 'row'
	},
	actionButton: {
		marginTop: 15,
		padding: 8,
		borderRadius: 5,
		borderWidth: 1,
		marginRight: 10,
		width: '80%',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: '10%'
	},
	buttonText: {
		color: 'white',
		justifyContent: 'center'
	}
});

export default SearchUser;
