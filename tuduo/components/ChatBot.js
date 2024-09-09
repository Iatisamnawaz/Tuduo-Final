import React, { useState, useEffect, useRef } from 'react';
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
	StyleSheet,
	LayoutAnimation,
	UIManager,
	Platform
} from 'react-native';

// Assuming API_KEY is stored in your environment variable correctly
const API_KEY = process.env.REACT_APP_OPEN_API_KEY;
console.log(`Using API Key: ${API_KEY}`);

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ChatBot = () => {
	const [ messages, setMessages ] = useState([]);
	const [ newMsg, setNewMsg ] = useState('');
	const flatListRef = useRef();
	const [ isTyping, setIsTyping ] = useState(false);

	// Function to handle sending messages
	const fetchMessageRes = async (messageContent) => {
		const updatedMessages = [ ...messages, { role: 'user', content: messageContent } ];
		setMessages(updatedMessages);
		setIsTyping(true); // Start typing animation

		try {
			const response = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${API_KEY}`
				},
				body: JSON.stringify({
					model: 'gpt-3.5-turbo',
					messages: updatedMessages.map((msg) => ({ role: msg.role, content: msg.content })),
					temperature: 0.7
				})
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(`API error: ${data.error ? data.error.message : 'Unknown error'}`);
			}

			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			setMessages([ ...updatedMessages, { role: 'assistant', content: data.choices[0].message.content } ]);
		} catch (error) {
			console.error('Error while fetching chat data:', error);
		} finally {
			setIsTyping(false); // Stop typing animation
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior="padding">
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<SafeAreaView style={styles.container}>
					<FlatList
						ref={flatListRef}
						style={styles.list}
						data={messages}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<View style={[ styles.item, item.role === 'user' ? styles.itemOut : styles.itemIn ]}>
								<View style={styles.balloon}>
									<Text style={{ color: 'white' }}>{item.content}</Text>
								</View>
							</View>
						)}
						ListFooterComponent={() =>
							isTyping ? (
								<View style={styles.typingIndicator}>
									<Text style={styles.typingText}>Assistant is typing...</Text>
								</View>
							) : null}
					/>
					<View style={styles.footer}>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.inputs}
								placeholder="Write a message..."
								underlineColorAndroid="transparent"
								onChangeText={setNewMsg}
								value={newMsg}
							/>
						</View>
						<TouchableOpacity
							style={styles.btnSend}
							onPress={() => {
								if (newMsg.trim()) {
									fetchMessageRes(newMsg);
									setNewMsg('');
								}
							}}
						>
							<Text style={{ color: 'white' }}>Send</Text>
						</TouchableOpacity>
					</View>
				</SafeAreaView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default ChatBot;

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
		width: 30,
		height: 30,
		alignSelf: 'center'
	},
	inputContainer: {
		borderColor: '#6A5ACD',
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		borderWidth: 1,
		height: 40,
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		marginRight: 10
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
	itemIn: {
		alignSelf: 'flex-start',
		backgroundColor: '#6A5ACD'
	},
	itemOut: {
		alignSelf: 'flex-end',
		backgroundColor: '#5B3918'
	},
	time: {
		alignSelf: 'flex-end',
		margin: 15,
		fontSize: 12,
		color: 'white'
	},
	item: {
		marginVertical: 14,
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#424530',
		borderRadius: 5,
		padding: 5
	},
	typingIndicator: {
		marginVertical: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	typingText: {
		color: '#cccccc',
		fontStyle: 'italic'
	}
});
