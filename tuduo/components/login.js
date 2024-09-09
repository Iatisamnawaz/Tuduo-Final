import React, { createRef, useState } from 'react';
import { SafeAreaView, Text, View, KeyboardAvoidingView, TextInput, StyleSheet, Keyboard, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { auth } from '../database/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { styles } from '../Styles/loginStyle';



const Login = ({ navigation }) => {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ error, setError ] = useState('');

	const [ loggedIn, setLoggedIn ] = useState(false);

	onAuthStateChanged(auth, (user) => {
		if (user) {
			setLoggedIn(true);
			navigation.replace('Home');
		} else {
			setLoggedIn(false);
		}
	});
	// Handling login for app when form submitted
	const handleLogin = () => {
		setError('');
		if (!email) {
			alert('Please fill Email');
			return;
		}
		if (!password) {
			alert('Please fill Password');
			return;
		}
		auth
			.signInWithEmailAndPassword(email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;
				console.log('Logged in with:', user.email);
			})
			.catch((error) => alert(error.message));
	};
	// Rendering the login form
	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView behavior="padding">
				<Image source={require('../assets/TuDuo PNG/1.png')} style={styles.icon} />
				<View style={styles.section}>
					<TextInput
						style={styles.inputStyle}
						placeholder="Email"
						onChangeText={(text) => setEmail(text)}
						keyboardType="email-address"
						returnKeyType="next"
					/>
				</View>
				<View style={styles.section}>
					<TextInput
						style={styles.inputStyle}
						placeholder="Password"
						onChangeText={(text) => setPassword(text)}
						keyboardType="default"
						onSubmitEditing={Keyboard.dismiss}
						blurOnSubmit={false}
						secureTextEntry={true}
						returnKeyType="next"
					/>
				</View>
				{error != '' ? <Text style={styles.errorText}> {error} </Text> : null}
				<TouchableOpacity style={styles.logButton} activeOpacity={0.5} onPress={handleLogin}>
					<Text style={styles.logText}>Login</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Register')}>
					<Text style={styles.linkText}>Don't have an account? Register Now!</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Login;
