import React from 'react';
import { render } from '@testing-library/react-native';
import ChatScreen from '../../components/ChatScreen';

describe('ChatScreen', () => {
	it('renders correctly', () => {
		const { getByPlaceholderText } = render(<ChatScreen />);
		expect(getByPlaceholderText('Write a message...')).toBeTruthy();
	});
});

jest.mock('firebase/compat/app', () => {
	return {
		auth: () => ({
			currentUser: {
				uid: '123'
			}
		})
	};
});
