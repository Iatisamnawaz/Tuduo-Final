import { Text, View, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import React, { Component } from 'react';
import { AntDesign } from '@expo/vector-icons';

export default class AddTasks extends Component {
	backgroundColors = [ '#485935', '#93A267', '#CADBB7', '#A59E74', '#694315' ];
	state = {
		name: '',
		color: this.backgroundColors[0]
	};

	createTodo = () => {
		const { name, color } = this.state;

		const list = { name, color };

		this.props.addList(list);
		this.setState({ name: '' });
		this.props.closeModal();
	};

	renderColors() {
		return this.backgroundColors.map((color) => {
			return (
				<TouchableOpacity
					key={color}
					style={{ backgroundColor: color }}
					className="w-[30px] h-[30px] rounded-md "
					onPress={() => this.setState({ color })}
				/>
			);
		});
	}

	render() {
		return (
			<KeyboardAvoidingView className="flex-1 justify-center items-center  " behaviour="padding">
				<TouchableOpacity className="absolute top-[64px] right-[32px]" onPress={this.props.closeModal}>
					<AntDesign name="close" size={24} />
				</TouchableOpacity>

				<View className="self-stretch mx-12  ">
					<Text className="text-xl font-extrabold self-center text-black mb-[16px]"> Create Todo Lists</Text>
					<TextInput
						placeholder="List Name ?"
						className="border-2 border-blue rounded-md h-[50px] mt-8 px-[16px] text-normal"
						onChangeText={(text) => this.setState({ name: text })}
					/>

					<View className="flex-row justify-between mt-4 ">{this.renderColors()}</View>

					<TouchableOpacity
						className="mt-[24px] h-[50px] rounded-md items-center justify-center"
						style={{ backgroundColor: this.state.color }}
						onPress={this.createTodo}
					>
						<Text className="text-white font-semibold">Create !</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		);
	}
}
