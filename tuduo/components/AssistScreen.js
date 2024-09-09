import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default class AssistScreen extends Component {
	state = {
		advice: 'Loading advice...',
		activity: 'Loading activity...',
		loading: true,
		error: null
	};

	componentDidMount() {
		this.queryOpenAI();
	}
	queryOpenAI = async () => {
		this.setState({ loading: true });
		const API_KEY = process.env.REACT_APP_OPEN_API_KEY;

		try {
			const headers = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${API_KEY}`
			};

			const body = JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: 'Give a piece of relationship advice and suggest a fun activity.' }
				]
			});

			const response = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: headers,
				body: body
			});

			if (!response.ok) {
				const errorText = await response.text(); // Try to read the response body even in case of HTTP error
				throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
			}

			const data = await response.json(); // Parse the JSON response body
			const advice = data.choices[0].message.content.split('\n\n')[0]; // Assume the first part is advice
			const activity = data.choices[0].message.content.split('\n\n')[1]; // Assume the second part is activity suggestion
			this.setState({
				advice: advice,
				activity: activity,
				loading: false,
				error: null
			});
		} catch (error) {
			console.error('Error fetching data from OpenAI:', error);
			this.setState({ error: 'Failed to fetch data. Please try again.', loading: false });
		}
	};

	render() {
		const { advice, activity, loading, error } = this.state;

		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFEFCD' }}>
				<View
					style={{
						width: '90%',
						padding: 20,
						backgroundColor: '#5B3918',
						borderRadius: 10,
						shadowRadius: 5,
						marginBottom: 10
					}}
				>
					<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'white' }}>
						Today's Advice
					</Text>
					{loading ? (
						<ActivityIndicator size="small" color="#FFFFFF" />
					) : (
						<Text style={{ color: 'white' }}>{advice}</Text>
					)}
				</View>

				<TouchableOpacity
					onPress={this.queryOpenAI}
					style={{
						width: '90%',
						padding: 20,
						backgroundColor: '#5B3918',
						borderRadius: 10,
						shadowRadius: 5,
						marginBottom: 10
					}}
				>
					<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'white' }}>
						Suggested Activities
					</Text>
					{loading ? (
						<ActivityIndicator size="small" color="#FFFFFF" />
					) : error ? (
						<Text style={{ color: 'red' }}>{error}</Text>
					) : (
						<Text style={{ color: 'white' }}>{activity}</Text>
					)}
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => this.props.navigation.navigate('ChatBot')}
					style={{
						width: '90%',
						padding: 20,
						backgroundColor: '#FF8C00',
						borderRadius: 10,
						shadowRadius: 5,
						marginBottom: 10,
						borderWidth: 4,
						borderColor: '#6A5ACD'
					}}
				>
					<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'white' }}>
						Tuduo's ChatBot
					</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={{ fontSize: 16, color: '#FFFFFF', marginRight: 5 }}>Chat Now</Text>
						<Text style={{ fontSize: 16, color: '#FFFFFF' }}>→</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}
