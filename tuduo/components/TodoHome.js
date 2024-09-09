import React from 'react';
import { Text, View, TouchableOpacity, FlatList, Modal, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import TuduoList from './TuduoList';
import AddTasks from './AddTasks';
import { auth, db } from '../database/Firebase';

// import TopNavgiation from './TopNavgiation';

export default class TodoHome extends React.Component {
	state = {
		addTodoVisible: false,
		lists: [],
		user: {},
		loading: true
	};

	toggleAddTodoModal() {
		this.setState({ addTodoVisible: !this.state.addTodoVisible });
	}

	subscribe = () => {
		let user = auth.currentUser;
		console.log(user);
		if (user) {
			let ref = db.collection('users').doc(user.uid).collection('lists');
			console.log('this is the entering of a new list');
			console.log(ref);

			return ref;
		}
	};

	unsubscribe = () => {
		let user = auth.currentUser;
		if (user) {
			let ref = this.subscribe();
			ref.orderBy('name').onSnapshot((snapshot) => {
				const list = [];
				if (snapshot) {
					snapshot.forEach(async (doc) => {
						list.push({ id: doc.id, ...doc.data() });
					});
				}
				this.setState({
					lists: list,
					user: auth.currentUser.uid,
					loading: false
				});
			});
		}
	};

	addTodo = (list) => {
		let ref = this.subscribe();
		ref.add(list);
	};
	deleteList = (list) => {
		let ref = this.subscribe();
		ref.doc(list.id).delete();
	};
	updateTodo = (list) => {
		let ref = this.subscribe();
		ref.doc(list.id).update(list);
	};
	componentDidMount = () => {
		this.unsubscribe();
	};
	componentWillUnmount = () => {
		this.unsubscribe();
	};

	renderList = (list) => {
		return (
			<TuduoList list={list} updateList={this.updateList} deleteList={this.deleteList} editList={this.editList} />
		);
	};

	// renderList = (list) => {
	// 	return <TuduoList list={list} updateList={this.updateList} />;
	// };

	addList = (list) => {
		console.log(list);
		this.addTodo({
			name: list.name,
			color: list.color,
			todos: []
		});
	};

	updateList = (list) => {
		this.updateTodo(list);
	};
	editList = (list) => {
		let ref = this.subscribe();

		ref.doc(list.id).update(list);
	};

	render() {
		return (
			<View className="flex-1 bg-white items-center pt-4 bg-themeSeven">
				<Modal
					animationType="slide"
					visible={this.state.addTodoVisible}
					onRequestClose={() => this.toggleAddTodoModal()}
				>
					<AddTasks closeModal={() => this.toggleAddTodoModal()} addList={this.addList} />
				</Modal>
				<View>{/* <Text>User : {this.state.user.uid}</Text> */}</View>

				<View className="flex-row">
					<View className="flex-2 self-center h-1 bg-lightblue " />
					<Text className="text-4xl font-extrabold px-9 text-black mt-2	">
						TuDuo <Text className="font-light text-themeOne"> Lists </Text>
					</Text>

					<View className="my-2 pt-0">
						<TouchableOpacity
							className=" border-2 border-themeEight bg-themeEight rounded mx-10 px-8 py-2 items-center justify-center"
							onPress={() => this.toggleAddTodoModal()}
						>
							<AntDesign name="plus" size={20} color="#ffffff" />
						</TouchableOpacity>
					</View>
				</View>

				<View className=" items-center mt-4  w-[100%] ">
					<View className=" w-[100%] ">
						<FlatList
							data={this.state.lists}
							keyExtractor={(item) => item.name}
							showsVerticalScrollIndicator={false}
							renderItem={({ item }) => this.renderList(item)}
							keyboardShouldPersistTaps="always"
						/>
					</View>
				</View>
			</View>
		);
	}
}
