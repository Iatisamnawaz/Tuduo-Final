import React from 'react';
import { Text, View, TouchableOpacity, Modal } from 'react-native';
import Todos from './Todos';

export default class TuduoList extends React.Component {
	state = {
		showListVisible: false
	};

	toggleListModal() {
		this.setState({ showListVisible: !this.state.showListVisible });
	}
	render() {
		const list = this.props.list;
		console.log('this is from page tasks completed and stuff');
		console.log(list);

		const cardColor = list.color;
		const tasksCompleted = list.todos.filter((todo) => todo.completed).length;
		const tasksLeft = list.todos.length - tasksCompleted;
		return (
			<View className=" flex">
				<View className="">
					<Modal
						animationType="slide"
						visible={this.state.showListVisible}
						onRequestClose={() => this.toggleListModal()}
					>
						<Todos
							list={list}
							closeModal={() => this.toggleListModal()}
							updateList={this.props.updateList}
						/>
					</Modal>

					<TouchableOpacity
						className="py-4 px-4 rounded-xl mh-12  mx-10 mb-4"
						style={{ backgroundColor: cardColor }}
						onPress={() => this.toggleListModal()}
					>
						<Text numberOfLines={1} className=" text-xl font-bold text-white mb-2">
							{list.name}
						</Text>
						<View className="justify-between flex-row">
							<Text className="text-white text-xl font-normal	">Remaining</Text>
							<Text className="text-white text-xl font-normal	">{tasksLeft}</Text>
						</View>
						<View className="justify-between flex-row">
							<Text className="text-white text-xl font-normal	 ">Completed</Text>
							<Text className="text-white text-xl font-normal	">{tasksCompleted}</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}
