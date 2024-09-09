module.exports = {
	preset: 'jest-expo',
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': 'babel-jest' // Use babel-jest to transpile JavaScript and TypeScript files
	},
	transformIgnorePatterns: [
		'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-native-community|firebase|@firebase/.*)'
	],
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
	}
};
