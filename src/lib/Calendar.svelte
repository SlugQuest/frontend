<script lang="ts">
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import Interaction from '@event-calendar/interaction';
	import { taskStore } from './taskStore';
	import type { Task } from '$lib/taskStore';
	import { onMount } from 'svelte';
	import EditTaskModel from './EditTaskModel.svelte';
	import AddTask from './AddTask.svelte';
	import { writable } from 'svelte/store';
	import { BACKEND_URL } from './BackendURL';
	import TaskCardModel from './TaskCardModel.svelte';

	onMount(async () => {
		taskStore.prepareTasks();
	});

	let tasks: Task[] = [];

	/*
	taskStore.subscribe((value) => {
		tasks = value;
	});
  */

	async function getTasks(start: string, end: string) {
		let url = `${BACKEND_URL}/api/v1/userTasks/${start}/${end}`;
		let response = await fetch(url, {
			method: 'GET',
			credentials: 'include'
		});
		let data: { list: any[] } = await response.json();
		console.log(data);
		tasks = data.list;
	}

	type Event = {
		start: string;
		end: string;
		resourceId: number;
		display: string;
		startEditable: boolean;
		durationEditable: boolean;
		editable: boolean;
		title?: string;
		color?: string;
		allDay?: boolean;
	};

	function convert_task(task: Task): Event {
		const editable = !task.IsRecurring;
		return {
			start: task.StartTime,
			end: task.EndTime,
			resourceId: task.TaskID,
			display: 'default',
			startEditable: editable,
			durationEditable: editable,
			editable,
			title: task.TaskName,
			allDay: task.IsAllDay
		};
	}

	function convert_event(event: GetEvent): Task | undefined {
		let index_int = parseInt(event.resourceIds[0]);
		let prev_task = taskStore.getTask(index_int);
		if (prev_task === undefined) {
			console.log('Task not found');
			return;
		}
		let start = new Date(event.start);
		start.setHours(start.getHours() - 8);
		let start_str = start.toISOString();
		start_str = start_str.replace(':00.000Z', '');
		let end = new Date(event.end);
		end.setHours(end.getHours() - 8);
		let end_str = end.toISOString();
		end_str = end_str.replace(':00.000Z', '');
		return {
			...prev_task,
			TaskID: index_int,
			StartTime: start_str,
			EndTime: end_str
		};
	}

	function gen_tasks(tasks: Task[] = []) {
		let events = tasks.map(convert_task);

		return events;
	}

	type GetEvent = {
		start: string;
		end: string;
		resourceIds: string[];
		display: string;
		startEditable: boolean;
		durationEditable: boolean;
		editable: boolean;
		title?: string;
		color?: string;
		allDay?: boolean;
	};

	type Info = {
		event: GetEvent;
		delta: {
			days: number;
			milliseconds: number;
			minutes: number;
			months: number;
			seconds: number;
			years: number;
		};
		revert: () => void;
	};

	function update_callback(info: Info) {
		let task = convert_event(info.event);
		if (task === undefined) {
			console.log('Task not found');
			return;
		}
		taskStore.updateTask(task);
	}

	let model_store = writable(
		tasks.map((task) => {
			return {
				task,
				open: false
			};
		})
	);

	taskStore.subscribe((value) => {
		model_store.set(
			value.map((task) => {
				return {
					task,
					open: false
				};
			})
		);
	});

	let tasks_model = [];

	model_store.subscribe((value) => {
		tasks_model = value;
	});

	$: events = gen_tasks(tasks);

	let plugins = [TimeGrid, Interaction];
	$: options = {
		view: 'timeGridWeek',
		events,
		eventDrop: update_callback,
		eventResize: update_callback,
		eventClick: (info: Info) => {
			let task = convert_event(info.event);
			if (task === undefined) {
				console.log('Task not found');
				return;
			}
			model_store.update((tasks) => {
				return tasks.map((task_model) => {
					if (task_model.task.TaskID === task?.TaskID) {
						task_model.open = true;
					}
					return task_model;
				});
			});
		},
		datesSet: (info: { startStr: string; endStr: string }) => {
			getTasks(info.startStr + 'Z', info.endStr + 'Z');
		}
	};
</script>

<div class="m-5 p-3 rounded-lg border-2 border-gray-200">
	<Calendar {plugins} {options} />
</div>

{#each $model_store as task_model}
	<TaskCardModel task={task_model.task} bind:show={task_model.open} />
{/each}
