import { writable } from 'svelte/store';
import { BACKEND_URL } from './BackendURL';

async function fetchTasks() {
    const response = await fetch(`${BACKEND_URL}/api/v1/tasks`, {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
}

function createTaskStore() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        addTask: (task) => update(tasks => [...tasks, task]),
        removeTask: (id) => update(tasks => tasks.filter(task => task.TaskID !== id)),
        prepareTasks: async function() {
            const fetchedTasks = await fetchTasks();
            set(fetchedTasks.list); // set the list property of fetchedTasks to the taskStore
        }
    };
}
    export const taskStore = createTaskStore();
