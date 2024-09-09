import {
	Text,
	View,
	SafeAreaView,
	TouchableOpacity,
	FlatList,
	KeyboardAvoidingView,
	TextInput,
	Keyboard,
	Animated
} from 'react-native';
import React, { Component } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

export default class Todos extends Component {
	state = {
		newTodo: ''
	};

	toggleTodoCompleted = (index) => {
		let list = this.props.list;
		list.todos[index].completed = !list.todos[index].completed;
		this.props.updateList(list);
	};

	addTodo = () => {
		let list = this.props.list;

		if (!list.todos.some((todo) => todo.title === this.state.newTodo)) {
			list.todos.push({ title: this.state.newTodo, completed: false });

			this.props.updateList(list);
		}

		this.setState({ newTodo: '' });

		Keyboard.dismiss();
	};

	deleteTodo = (index) => {
		let list = this.props.list;
		list.todos.splice(index, 1);
		this.props.updateList(list);
	};

	renderTodo = (todo, index) => {
		const blackColor = '#313332';
		const greyColor = '#616161';
		return (
			<Swipeable renderRightActions={(_, dragX) => this.rightActions(dragX, index)}>
				<View className="py-[16px] flex-row items-center">
					<TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
						<Ionicons name={todo.completed ? 'square' : 'square-outline'} size={24} style={{ width: 32 }} />
					</TouchableOpacity>
					<Text
						className="text-black font-bold text-base"
						style={{
							textDecorationLine: todo.completed ? 'line-through' : 'none',
							color: todo.completed ? greyColor : blackColor
						}}
					>
						{todo.title}
					</Text>
				</View>
			</Swipeable>
		);
	};

	rightActions = (dragX, index) => {
		const scale = dragX.interpolate({
			inputRange: [ -100, 0 ],
			outputRange: [ 1, 0.9 ],
			extrapolate: 'clamp'
		});
		const opacity = dragX.interpolate({
			inputRange: [ -100, -20, 0 ],
			outputRange: [ 1, 0.9, 0 ],
			extrapolate: 'clamp'
		});

		return (
			<TouchableOpacity onPress={() => this.deleteTodo(index)}>
				<Animated.View
					className="flex-1 justify-center items-center w-[80px] bg-red-600 "
					style={{ opacity: opacity }}
				>
					<Animated.Text className="text-red font-bold " style={{ transform: [ { scale } ] }}>
						Delete
					</Animated.Text>
				</Animated.View>
			</TouchableOpacity>
		);
	};
	render() {
		const list = this.props.list;

		const taskCount = list.todos.length;
		const completedCount = list.todos.filter((todo) => todo.completed).length;

		return (
			<KeyboardAvoidingView className="flex-1" behavior="padding">
				<SafeAreaView className=" flex-1 justify-center items-center">
					<TouchableOpacity className="absolute top-[64px] right-[32px] z-10" onPress={this.props.closeModal}>
						<AntDesign name="close" size={24} />
					</TouchableOpacity>

					<View
						className="flex-1 self-stretch justify-end ml-[34px] border-b-4 mt-[-120]"
						style={{ borderBottomColor: list.color }}
					>
						<View>
							<Text className="text-2xl font-bold text-black">{list.name}</Text>
							<Text className="mt-2 mb-8 text-gray font-normal">
								{completedCount} of {taskCount} Tasks
							</Text>
						</View>
					</View>
					<View className="flex-1 self-stretch flex-3">
						<FlatList
							data={list.todos}
							renderItem={({ item, index }) => this.renderTodo(item, index)}
							keyExtractor={(item) => item.title}
							contentContainerStyle={{ paddingHorizontal: 32, paddindVertical: 64 }}
							showsVerticalScrollIndicator={false}
						/>
					</View>
					<KeyboardAvoidingView
						className="flex-1 self-stretch ph-[32px] flex-row items-center px-[30px]"
						behavior="padding"
					>
						<TextInput
							style={{ borderColor: list.color }}
							className="flex-1 h-[48px] border rounded-md mr-[8px] pl-[12px] py-[8px]"
							onChangeText={(text) => this.setState({ newTodo: text })}
							value={this.state.newTodo}
						/>
						<TouchableOpacity
							style={{ backgroundColor: list.color }}
							className="rounded-md p-[16px] items-center justify-center"
							onPress={() => this.addTodo()}
						>
							<AntDesign name="plus" size={16} />
						</TouchableOpacity>
					</KeyboardAvoidingView>
				</SafeAreaView>
			</KeyboardAvoidingView>
		);
	}
}
