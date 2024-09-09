// __mocks__/firebase.js
const firebase = {
	auth: jest.fn(() => ({
		signInWithEmailAndPassword: jest.fn(),
		createUserWithEmailAndPassword: jest.fn(),
		signOut: jest.fn(),
		onAuthStateChanged: jest.fn()
	})),
	firestore: jest.fn(() => ({
		collection: jest.fn()
	}))
};

export default firebase;
