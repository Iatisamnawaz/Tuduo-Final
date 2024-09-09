import React, { createRef, useState } from 'react';
import { SafeAreaView, Text, View, KeyboardAvoidingView, TextInput, StyleSheet, Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { auth, db } from '../database/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { styles } from '../Styles/registerStyle';
// import DatePicker from 'react-native-date-picker';
// import moment from 'moment';

const addUserToFirestore = async (username) => {
	const userId = auth.currentUser.uid;

	// Add the user to Firestore
	await db.collection('users').doc(userId).set({
		username: username,
		email: auth.currentUser.email
	});
};
// Registering page
const Register = ({ navigation }) => {
	const [ username, setUsername ] = useState('');
	const [ gender, setGender ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ error, setError ] = useState('');
	// Handling registeration when form submitted
	const handleRegister = () => {
		setError('');
		if (!username) {
			alert('Please fill name');
			return;
		}
		if (!email) {
			alert('Please fill Email');
			return;
		}
		if (!password) {
			alert('Please fill Password');
			return;
		}
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((user) => {
				console.log('Registration Successful. Please Login to proceed');
				console.log(user);
				if (user) {
					auth.currentUser
						.updateProfile({
							displayName: username
						})
						.then(() => {
							// Add user to Firestore after successfully updating profile
							addUserToFirestore(username)
								.then(() => {
									navigation.navigate('Home'); // Navigate to Home after saving to Firestore
								})
								.catch((error) => {
									alert(error);
									console.error('Error adding user to Firestore: ', error);
								});
						})
						.catch((error) => {
							alert(error);
							console.error(error);
						});
				}
			})
			.catch((error) => {
				console.log(error);
				if (error.code === 'auth/email-already-in-use') {
					setError('That email address is already in use!');
				} else {
					setError(error.message);
				}
			});
	};
	// Rendering Form
	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView enabled>
				<Text style={styles.title}>Live Happier</Text>
				<View style={styles.section}>
					<TextInput
						style={styles.inputStyle}
						placeholder="Name"
						onChangeText={(text) => setUsername(text)}
						returnKeyType="next"
					/>
				</View>
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
						placeholder="Gender"
						onChangeText={(text) => setGender(text)}
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
				<View style={styles.section}>
					<TextInput
						style={styles.inputStyle}
						placeholder="Re-Enter Password"
						onChangeText={(text) => setPassword(text)}
						keyboardType="default"
						onSubmitEditing={Keyboard.dismiss}
						blurOnSubmit={false}
						secureTextEntry={true}
						returnKeyType="next"
					/>
				</View>
				{error != '' ? <Text style={styles.errorText}> {error} </Text> : null}
				<TouchableOpacity style={styles.logButton} activeOpacity={0.5} onPress={handleRegister}>
					<Text style={styles.logText}>Register</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.navigate('Login')}>
					<Text style={styles.linkText}>Already have an account? Login then!</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Register;
