import React, { Component } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { auth, relationships, users } from '../database/Firebase';

export default class ProfileScreen extends Component {
	state = {
		connectedUsername: null,
		isConnected: false,
		tasksOverview: {
			completed: 0,
			pending: 2
		}
	};

	componentDidMount() {
		this.checkConnection();
	}

	checkConnection = () => {
		const userId = auth.currentUser.uid;
		relationships
			.where('user1', '==', userId)
			.where('status', '==', 'connected')
			.get()
			.then((querySnapshot) => {
				if (!querySnapshot.empty) {
					const connectedUserId = querySnapshot.docs[0].data().user2;
					this.fetchConnectedUserDetails(connectedUserId);
				} else {
					this.setState({ isConnected: false });
				}
			})
			.catch((error) => console.error('Error fetching connection: ', error));
	};

	fetchConnectedUserDetails = (userId) => {
		users
			.doc(userId)
			.get()
			.then((doc) => {
				if (doc.exists) {
					this.setState({
						connectedUsername: doc.data().username,
						isConnected: true
					});
				}
			})
			.catch((error) => {
				console.error('Error fetching connected user details: ', error);
			});
	};

	handleLogout = () => {
		auth
			.signOut()
			.then(() => {
				this.props.navigation.navigate('Login');
			})
			.catch((error) => alert(error.message));
	};

	render() {
		const { isConnected, connectedUsername } = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.profileContainer}>
					<Text style={styles.profileText}>Iatisam Nawaz</Text>
					<Text style={styles.profileText}>Male</Text>
					<Text style={styles.statusLabel}>Status</Text>
					<Text style={styles.statusText}>
						{isConnected ? `Connected to ${connectedUsername}` : 'Disconnected'}
					</Text>
				</View>

				<View style={styles.buttonContainer}>
					<Pressable
						style={[ styles.button, { marginRight: isConnected ? 0 : 10 } ]}
						onPress={() => this.props.navigation.navigate('SearchUser')}
					>
						<Text style={styles.buttonText}>{isConnected ? 'Disconnect' : 'Connect'}</Text>
					</Pressable>
					{!isConnected && (
						<Pressable style={styles.button} onPress={() => this.props.navigation.navigate('Requests')}>
							<Text style={styles.buttonText}>Requests</Text>
						</Pressable>
					)}
				</View>

				<Pressable style={styles.logoutButton} onPress={this.handleLogout}>
					<Text style={styles.logoutText}>Logout</Text>
				</Pressable>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		flex: 1,
		backgroundColor: '#FFEFCD'
	},
	profileContainer: {
		height: 160,
		padding: 16,
		backgroundColor: '#5B3918',
		shadowRadius: 4,
		marginBottom: 12,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: '#5B3918',
		alignItems: 'center',
		justifyContent: 'center'
	},
	profileText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 4
	},
	statusLabel: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'white',
		paddingTop: 12
	},
	statusText: {
		color: 'white'
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginVertical: 12
	},
	button: {
		backgroundColor: 'black',
		padding: 10,
		borderRadius: 6,
		width: '45%'
	},
	buttonText: {
		textAlign: 'center',
		color: 'white'
	},
	logoutButton: {
		padding: 10,
		borderRadius: 6,
		marginTop: 15,
		backgroundColor: '#FF8C00'
	},
	logoutText: {
		textAlign: 'center',
		fontWeight: 'bold',
		color: 'black'
	}
});
