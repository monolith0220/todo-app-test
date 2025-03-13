import { defineStore } from "pinia";
import { computed, ref } from "vue";

// todoの型定義
export interface Todo {
	id: number;
	text: string;
}

export const useTodoStore = defineStore("todo", () => {
	// ローカルストレージから読み込み
	const todos = ref<Todo[]>(JSON.parse(localStorage.getItem("task") ?? "[]"));
	const nextId = ref(1);
	const selectedTodos = ref<number[]>([]); // 選択されたTodoのIDを管理

	// Todoを追加
	const addTodo = (text: string) => {
		todos.value.push({ id: nextId.value++, text });
		localStorage.setItem("task", JSON.stringify(todos.value));
	};

	// 選択したTodoを削除
	const deleteTodo = (id: number) => {
		todos.value = todos.value.filter((todo) => todo.id !== id);
		localStorage.setItem("task", JSON.stringify(todos.value));
	};

	// 選択したTodoを一括削除
	const deleteSelectedTodos = () => {
		todos.value = todos.value.filter(
			(todo) => !selectedTodos.value.includes(todo.id)
		);
		localStorage.setItem("task", JSON.stringify(todos.value));
		selectedTodos.value = []; // 削除後に選択リストをリセット
	};

	// すべてのTodoが選択されているかを判定
	const allSelected = computed(() => {
		return (
			todos.value.length > 0 &&
			selectedTodos.value.length === todos.value.length
		);
	});

	// すべてのTodoを選択/解除
	const toggleSelectAll = () => {
		if (allSelected.value) {
			selectedTodos.value = [];
		} else {
			selectedTodos.value = todos.value.map((todo) => todo.id);
		}
	};

	return {
		todos,
		nextId,
		addTodo,
		deleteTodo,
		deleteSelectedTodos,
		selectedTodos,
		allSelected,
		toggleSelectAll,
	};
});
