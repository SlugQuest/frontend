import { writable } from 'svelte/store';
import { BACKEND_URL } from './BackendURL';

export type Task = {
	TaskID: number;
	UserID: string;
	Category: string;
	TaskName: string;
	Description: string;
	StartTime: string;
	EndTime: string;
	Status: string;
	IsRecurring: boolean;
	IsAllDay: boolean;
	Difficulty: string;
	CronExpression: string;
};

export type CreateTask = {
	Category: string;
	TaskName: string;
	Description: string;
	StartTime: string;
	EndTime: string;
	Status: string;
	IsRecurring: boolean;
	IsAllDay: boolean;
	Difficulty: string;
	CronExpression: string;
};

async function fetchTasks(): Promise<{ list: Task[] }> {
	const response = await fetch(`${BACKEND_URL}/api/v1/tasks`, {
		credentials: 'include'
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data;
}

export enum ResultEnum {
	Ok = 200,
	BadRequest = 400
}

function createTaskStore() {
	const { subscribe, set, update } = writable<Task[]>([]);

	return {
		subscribe,
		addTask: async (task: CreateTask): Promise<ResultEnum> => {
			console.log('Adding task');
			const response = await fetch(`${BACKEND_URL}/api/v1/task`, {
				method: 'POST',
				body: JSON.stringify(task),
				credentials: 'include'
			});
			if (!response.ok) {
				return 'error';
			}

			const data = await response.json();

			update((tasks) => {
				tasks.push(data);
				return tasks;
			});
			return 'success';
		},
		removeTask: (id: number) => update((tasks) => tasks.filter((task) => task.TaskID !== id)),
		prepareTasks: async function () {
			const fetchedTasks = await fetchTasks();
			set(fetchedTasks.list); // set the list property of fetchedTasks to the taskStore
		},
		updateTask: async (task: Task) => {
			console.log('task', task);
			/*
                  "TaskID":         1,
                  "UserID":         "testUserId",
                  "Category":       "yo",
                  "TaskName":       "New Task",
                  "Description":    "Description of the new task",
                  "StartTime":      "2024-01-01T08:00:00Z",
                  "EndTime":        "2024-01-01T17:00:00Z",
                  "Status":         "completed",
                  "IsRecurring":    false,
                  "IsAllDay":       false,
                  "Difficulty":     "easy",
                  "CronExpression": "" //for now, recurring functions are not supported
            */
			let request = {
				task: task
			};
			let str = JSON.stringify(request);
			console.log('str', str);
			// /api/v1/task/:id
			let result = await fetch(`${BACKEND_URL}/api/v1/task/${task.TaskID}`, {
				method: 'PUT',
				credentials: 'include',
				body: str
			});
			console.log('result', result);
			let new_tasks = await fetchTasks();
			console.log('new_tasks', new_tasks.list[0]);
			set(new_tasks.list);
		},
		getTask: (id: number): Task | undefined => {
			let task: Task | undefined;
			update((tasks) => {
				task = tasks.find((t) => t.TaskID === id);
				return tasks;
			});
			return task;
		}
	};
}
export const taskStore = createTaskStore();
