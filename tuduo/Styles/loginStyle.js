import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFEFCD',
		alignItems: 'center',

		justifyContent: 'center'
	},
	title: {
		fontSize: 25,
		fontWeight: '300',
		color: 'black',
		textAlign: 'center',
		marginTop: '5%',
		marginBottom: '5%'
	},
	icon: {
		width: 300,
		height: 300,
		alignSelf: 'center'
	},
	section: {
		flexDirection: 'row',
		height: 50,
		width: '100%',
		paddingHorizontal: '10%',
		margin: '2%'
	},
	inputStyle: {
		flex: 1,
		color: 'black',
		paddingLeft: 15,
		paddingRight: 15,
		borderWidth: 1,
		borderRadius: 10,
		borderColor: '#E09132'
	},
	logButton: {
		backgroundColor: '#E09132',
		width: '60%',
		marginHorizontal: '20%',
		borderRadius: 12,
		marginVertical: '3%',
		height: 45
	},
	logText: {
		color: 'white',
		paddingVertical: 12,
		justifyContent: 'center',
		fontSize: 18,
		fontWeight: 400,
		textAlign: 'center'
	},
	errorText: {
		color: 'red',
		textAlign: 'center',
		fontSize: 14
	},
	linkText: {
		color: 'gray',
		paddingVertical: 8,
		justifyContent: 'center',
		fontSize: 12,
		fontWeight: 500,
		textAlign: 'center',
		textDecorationLine: 'underline'
	}
});
export { styles };
