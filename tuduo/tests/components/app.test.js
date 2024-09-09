import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';

global.self = global;

describe('App', () => {
	it('renders the Screen component', () => {
		const { getByTestId } = render(<App />);
		expect(getByTestId('screen')).toBeTruthy();
	});
});

jest.mock('@env', () => {
	return {
		REACT_APP_OPEN_API_KEY: 'fake_api_key'
	};
});
