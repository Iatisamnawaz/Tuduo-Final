

export default function DatePickerField({ formik, name, title }) {
	const [ isDatePickerVisible, setDatePickerVisibility ] = useState(false);
	const [ birthDate, setBirthDate ] = useState('');
	const showDatePicker = () => setDatePickerVisibility(true);
	const hideDatePicker = () => setDatePickerVisibility(false);
}
