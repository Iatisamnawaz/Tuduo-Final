// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAFdkgNOk1wQAe5SFrKFkcA58X2YRKHsKU',
	authDomain: 'tuduo-7eee6.firebaseapp.com',
	projectId: 'tuduo-7eee6',
	storageBucket: 'tuduo-7eee6.appspot.com',
	messagingSenderId: '901625091289',
	appId: '1:901625091289:web:d8c72ca453f89ae9641ac8',
	measurementId: 'G-KRDFF4QWQD'
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
	app = firebase.initializeApp(firebaseConfig);
} else {
	app = firebase.app();
}

// initializing the variables for auth and datastore.
const auth = firebase.auth();
const db = firebase.firestore();

// db collections declared for the application
const sharedTodos = db.collection('sharedTodos');
const chats = db.collection('chats');
const relationships = db.collection('relationships');
const users = db.collection('users');

export { auth, db, chats, sharedTodos, relationships, users };
