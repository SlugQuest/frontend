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
    TeamID: number;
}

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

function createTaskStore() {
  const { subscribe, set, update } = writable<Task[]>([]);

  return {
    subscribe,
    addTask: (task: Task) => update(tasks => [...tasks, task]),
    removeTask: (id: number) => update(tasks => tasks.filter(task => task.TaskID !== id)),
    prepareTasks: async function() {
      const fetchedTasks = await fetchTasks();
      set(fetchedTasks.list); // set the list property of fetchedTasks to the taskStore
    },
    updateTask: (task: Task) => update(tasks => {
      const index = tasks.findIndex(t => t.TaskID.toString() === task.TaskID.toString());
      tasks[index] = task;
      return tasks;
    }),
    getTask: (id: number): Task | undefined => {
      let task: Task | undefined;
      update(tasks => {
        task = tasks.find(t => t.TaskID === id);
        return tasks;
      });
      return task;
    }
  };
}
export const taskStore = createTaskStore();
