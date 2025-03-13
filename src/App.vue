<script setup lang="ts">
import { ref, computed } from "vue";
import { useTodoStore } from "./stores/todoStore";
import type { Todo } from "./stores/todoStore";

const todoStore = useTodoStore();
const newTodo = ref("");
const selectedTodos = ref<number[]>([]); // 選択されたTodoのIDを管理

// Todoを追加
const addTodo = () => {
	if (newTodo.value.trim()) {
		todoStore.addTodo(newTodo.value);
		newTodo.value = "";
	}
};

// 選択したアイテムを一括削除
const deleteSelectedTodos = () => {
	selectedTodos.value.forEach((id) => todoStore.deleteTodo(id));
	// 削除後、選択リストをクリア
	selectedTodos.value = [];
};

// 全アイテムが選択されているかチェック
const allSelected = computed(() => {
	return (
		todoStore.todos.length > 0 &&
		selectedTodos.value.length === todoStore.todos.length
	);
});

// すべて選択 / 解除
const toggleSelectAll = () => {
	if (allSelected.value) {
		selectedTodos.value = [];
	} else {
		selectedTodos.value = todoStore.todos.map((todo: Todo) => todo.id);
	}
};

// todoの任意選択
const handleCheckboxChange = (event: Event, id: number) => {
	const target = event.target as HTMLInputElement;
	if (target.checked) {
		selectedTodos.value.push(id);
	} else {
		selectedTodos.value = selectedTodos.value.filter((todoId) => todoId !== id);
	}
};
</script>

<template>
	<div class="container">
		<h1>Todoリスト</h1>
		<div class="input-group">
			<input v-model="newTodo" placeholder="新しいTodoを追加" />
			<button @click="addTodo">追加</button>
		</div>

		<!-- 全選択チェックボックス -->
		<div class="select-all">
			<input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
			<label>すべて選択</label>
		</div>

		<ul>
			<li v-for="todo in todoStore.todos" :key="todo.id" class="todo-item">
				<input
					type="checkbox"
					:checked="selectedTodos.includes(todo.id)"
					@change="handleCheckboxChange($event, todo.id)"
				/>
				<span>
					{{ todo.text }}
				</span>
				<button @click="todoStore.deleteTodo(todo.id)">❌</button>
			</li>
		</ul>

		<!-- 一括削除ボタン -->
		<button @click="deleteSelectedTodos" :disabled="selectedTodos.length === 0">
			選択したアイテムを削除
		</button>
	</div>
</template>

<style scoped>
.container {
	max-width: 400px;
	margin: auto;
	text-align: center;
}
.input-group {
	display: flex;
	gap: 8px;
	margin-bottom: 16px;
}
input {
	padding: 8px;
}
button {
	padding: 8px;
	cursor: pointer;
}
ul {
	list-style: none;
	padding: 0;
}
.todo-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px;
	border-bottom: 1px solid #ccc;
	cursor: pointer;
}
.todo-item input {
	margin-right: 8px;
}
.select-all {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	gap: 8px;
}
</style>
