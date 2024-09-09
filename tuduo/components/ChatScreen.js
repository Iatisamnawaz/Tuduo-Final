import React, { useState, useEffect } from 'react';
import {
	Text,
	View,
	SafeAreaView,
	TouchableOpacity,
	FlatList,
	KeyboardAvoidingView,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
	Platform,
	Image,
	StyleSheet
} from 'react-native';

import { auth, chats, relationships } from '../database/Firebase';

const ChatScreen = () => {
	const [ messages, setMessages ] = useState([]);
	const [ newMsg, setNewMsg ] = useState('');
	const [ chatId, setChatId ] = useState('');
	const [ currentUserId, setCurrentUserId ] = useState('');

	useEffect(() => {
		const userId = auth.currentUser.uid;
		setCurrentUserId(userId);

		// Fetch chatId based on relationship
		const fetchChatId = async () => {
			// First try to find if the user is user1
			const relationshipQuery1 = relationships.where('status', '==', 'connected').where('user1', '==', userId);
			const snapshot1 = await relationshipQuery1.get();
			if (!snapshot1.empty) {
				const connectedUserId = snapshot1.docs[0].data().user2;
				return userId < connectedUserId ? `${userId}_${connectedUserId}` : `${connectedUserId}_${userId}`;
			} else {
				// If not found as user1, try finding as user2
				const relationshipQuery2 = relationships
					.where('status', '==', 'connected')
					.where('user2', '==', userId);
				const snapshot2 = await relationshipQuery2.get();
				if (!snapshot2.empty) {
					const connectedUserId = snapshot2.docs[0].data().user1;
					return userId < connectedUserId ? `${userId}_${connectedUserId}` : `${connectedUserId}_${userId}`;
				}
			}
			console.log('No connected user found.');
			return null;
		};

		// Subscribe to messages once chatId is fetched

		const setupChat = async () => {
			const fetchedChatId = await fetchChatId();
			if (fetchedChatId) {
				setChatId(fetchedChatId);
				return chats
					.doc(fetchedChatId)
					.collection('messages')
					.orderBy('timestamp', 'asc')
					.onSnapshot((snapshot) => {
						const fetchedMessages = snapshot.docs.map((doc) => ({
							id: doc.id,
							...doc.data(),
							timestamp: doc.data().timestamp.toDate(),
							isOutgoing: doc.data().senderId === userId // Determine if the message is outgoing
						}));
						setMessages(fetchedMessages);
					});
			}
		};

		const unsubscribe = setupChat();
		return () => (unsubscribe ? unsubscribe() : undefined);
	}, []);

	const sendMessage = () => {
		if (newMsg.trim() && chatId) {
			const messagePayload = {
				timestamp: new Date(),
				type: 'message',
				message: newMsg,
				senderId: currentUserId // Include sender ID in the message payload
			};
			chats
				.doc(chatId)
				.collection('messages')
				.add(messagePayload)
				.then(() => {
					setNewMsg('');
					Keyboard.dismiss();
				})
				.catch((error) => console.error('Error sending message:', error));
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<SafeAreaView style={styles.container}>
					<FlatList
						data={messages}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<View style={[ styles.item, item.isOutgoing ? styles.itemOut : styles.itemIn ]}>
								<View
									style={[ styles.balloon, item.isOutgoing ? styles.balloonOut : styles.balloonIn ]}
								>
									<Text>{item.message}</Text>
								</View>
								<Text style={styles.time}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
							</View>
						)}
					/>
					<View style={styles.footer}>
						<TextInput
							style={styles.inputs}
							placeholder="Write a message..."
							onChangeText={setNewMsg}
							value={newMsg}
							clearButtonMode="while-editing"
						/>
						<TouchableOpacity style={styles.btnSend} onPress={sendMessage}>
							<Image
								source={{ uri: 'https://img.icons8.com/small/75/ffffff/filled-sent.png' }}
								style={styles.iconSend}
							/>
						</TouchableOpacity>
					</View>
				</SafeAreaView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFEFCD'
	},
	list: {
		paddingHorizontal: 17
	},
	footer: {
		flexDirection: 'row',
		height: 60,
		paddingHorizontal: 10,
		padding: 5
	},
	btnSend: {
		backgroundColor: '#5B3918',
		width: 80,
		height: 40,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	iconSend: {
		width: 20,
		height: 20,
		alignSelf: 'center'
	},
	inputs: {
		height: 40,
		marginLeft: 16,
		borderBottomColor: '#FFFFFF',
		flex: 1
	},
	balloon: {
		maxWidth: 250,
		padding: 15,
		borderRadius: 20
	},
	balloonIn: {
		backgroundColor: '#E09132' // Incoming message color
	},
	balloonOut: {
		backgroundColor: '#5B3918' // Outgoing message color
	},
	itemIn: {
		alignSelf: 'flex-start'
	},
	itemOut: {
		alignSelf: 'flex-end'
	},
	time: {
		alignSelf: 'flex-end',
		margin: 15,
		fontSize: 12,
		color: '#5B3918'
	},
	item: {
		marginVertical: 14,
		flexDirection: 'row',
		backgroundColor: '#E09132',
		borderRadius: 5,
		padding: 5
	}
});

export default ChatScreen;
