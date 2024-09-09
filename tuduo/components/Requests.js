import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, db } from '../database/Firebase';

const UserRequests = () => {
	const [ requests, setRequests ] = useState([]);

	useEffect(() => {
		const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

		// Ensure currentUserId is defined before making the query
		if (currentUserId) {
			const fetchRequests = async () => {
				try {
					const querySnapshot = await db
						.collection('relationships')
						.where('user2', '==', currentUserId)
						.where('status', '==', 'pending')
						.get();

					const requestsData = [];
					querySnapshot.forEach((doc) => {
						requestsData.push({ id: doc.id, ...doc.data() });
					});

					setRequests(requestsData);
				} catch (error) {
					console.error('Error getting incoming requests: ', error);
				}
			};

			fetchRequests();
		} else {
			console.error('User not authenticated. currentUserId is undefined.');
		}
	}, []);

	const acceptRequest = async (relationshipId) => {
		try {
			await db.collection('relationships').doc(relationshipId).update({
				status: 'connected'
				// connectionDate: db.FieldValue.serverTimestamp()
			});
			alert('Request accepted!');
		} catch (error) {
			console.error('Error accepting request: ', error);
		}
	};

	const rejectRequest = async (relationshipId) => {
		try {
			await db.collection('relationships').doc(relationshipId).delete();
			alert('Request rejected!');
		} catch (error) {
			console.error('Error rejecting request: ', error);
		}
	};

	const renderRequestCard = ({ item }) => (
		<View style={styles.card}>
			<Text style={styles.cardTitle}>{item.user1Name}</Text>
			<View style={styles.cardContent}>
				<View style={styles.buttonsContainer}>
					<TouchableOpacity style={styles.actionButton} onPress={() => acceptRequest(item.id)}>
						<Text style={styles.buttonText}>Accept</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.actionButton} onPress={() => rejectRequest(item.id)}>
						<Text style={styles.buttonText}>Delete</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Requests</Text>
			<FlatList
				contentContainerStyle={styles.listContainer}
				data={requests}
				renderItem={renderRequestCard}
				keyExtractor={(item) => item.id.toString()}
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
	card: {
		flex: 1,
		marginBottom: 20,
		padding: 10,
		borderRadius: 8,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		marginHorizontal: 10
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: 'bold',
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
		marginHorizontal: 10,
		width: '40%',
		alignItems: 'center'
	},
	buttonText: {
		color: 'white'
	}
});

export default UserRequests;
