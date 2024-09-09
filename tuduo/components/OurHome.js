import React from 'react';
import { Text, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import TuduoList from './TuduoList';
import AddTasks from './AddTasks';
import { auth, sharedTodos, relationships } from '../database/Firebase';
import { Swipeable } from 'react-native-gesture-handler';

export default class OurHome extends React.Component {
	state = {
		addTodoVisible: false,
		sharedLists: [],
		loading: true,
		user: {}
	};

	fetchConnectedUsers = async () => {
		const userId = auth.currentUser.uid;
		try {
			const findRelationships = relationships
				.where('status', '==', 'connected')
				.where('user1', '==', userId)
				.get()
				.then((querySnapshot1) => {
					if (!querySnapshot1.empty) {
						return querySnapshot1.docs[0].data().user2;
					} else {
						// If not found as user1, try finding as user2
						return relationships
							.where('status', '==', 'connected')
							.where('user2', '==', userId)
							.get()
							.then((querySnapshot2) => {
								if (!querySnapshot2.empty) {
									return querySnapshot2.docs[0].data().user1;
								}
								return null; // No connected user found
							});
					}
				});
			return await findRelationships;
		} catch (error) {
			console.error('Failed to fetch connected user ID:', error);
			return null;
		}
	};
	fetchSharedTodos = () => {
		const userId = auth.currentUser.uid;
		const query1 = sharedTodos.where('user1', '==', userId);
		const query2 = sharedTodos.where('user2', '==', userId);

		Promise.all([ query1.get(), query2.get() ])
			.then((snapshots) => {
				const sharedLists = [];
				snapshots.forEach((snapshot) => {
					snapshot.forEach((doc) => {
						sharedLists.push({ id: doc.id, ...doc.data() });
					});
				});
				this.setState({ sharedLists, loading: false });
			})
			.catch((error) => {
				console.error('Error fetching shared todos: ', error);
			});
	};

	addTodo = async (list) => {
		const userId = auth.currentUser.uid; // user1
		const connectedUserId = await this.fetchConnectedUsers(); // fetch connected user2
		if (!connectedUserId) {
			console.error('No connected user found');
			return; // Exit if there's no connected user
		}

		// Add the new shared todo with both connected user IDs
		sharedTodos
			.add({
				user1: userId,
				user2: connectedUserId,
				name: list.name,
				color: list.color,
				todos: []
			})
			.then(() => {
				this.fetchSharedTodos(); // Refresh the list after adding
			})
			.catch((error) => {
				console.error('Error adding todo: ', error);
			});
	};

	componentDidMount() {
		this.fetchSharedTodos();
	}

	toggleAddTodoModal() {
		this.setState({ addTodoVisible: !this.state.addTodoVisible });
	}
	renderList = (list) => {
		return <TuduoList list={list} updateList={this.updateList} deleteList={this.deleteList} />;
	};

	updateList = (list) => {
		const ref = sharedTodos.doc(list.id);
		ref.update(list).then(() => {
			this.fetchSharedTodos();
		});
	};

	deleteList = (list) => {
		const ref = sharedTodos.doc(list.id);
		ref.delete().then(() => {
			this.fetchSharedTodos();
		});
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
			<TouchableOpacity onPress={() => this.deleteList(index)}>
				<Animated.View
					className="flex-1 justify-center items-center w-[80px] bg-red-600 "
					style={{ opacity: opacity }}
				>
					<Animated.Text className="text-white font-bold" style={{ transform: [ { scale } ] }}>
						Delete
					</Animated.Text>
				</Animated.View>
			</TouchableOpacity>
		);
	};

	render() {
		return (
			<View className="flex-1 bg-white items-center pt-4 bg-themeSeven">
				<Modal
					animationType="slide"
					visible={this.state.addTodoVisible}
					onRequestClose={() => this.toggleAddTodoModal()}
				>
					<AddTasks closeModal={() => this.toggleAddTodoModal()} addList={this.addTodo} />
				</Modal>

				<View className="flex-row">
					<View className="flex-2 self-center h-1 bg-lightblue " />
					<Text className="text-4xl font-extrabold px-9 text-black mt-2	">
						Shared <Text className="font-light text-themeOne"> Lists </Text>
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
							data={this.state.sharedLists}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => this.renderList(item)}
							contentContainerStyle={{ paddingBottom: 50 }}
						/>
					</View>
				</View>
			</View>
		);
	}
}
