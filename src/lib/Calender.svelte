<script lang="ts">
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import Interaction from '@event-calendar/interaction';
	import { taskStore } from './taskStore';
	import type { Task } from '$lib/taskStore';
	import { onMount } from 'svelte';

	onMount(async () => {
		taskStore.prepareTasks();
	});

	let tasks: Task[] = [];

	taskStore.subscribe((value) => {
		tasks = value;
	});

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
		return {
			start: task.StartTime,
			end: task.EndTime,
			resourceId: task.TaskID,
			display: 'default',
			startEditable: true,
			durationEditable: true,
			editable: true,
			title: task.TaskName,
			allDay: task.IsAllDay
		};
	}

	function convert_event(event: GetEvent): Task {
		return {
			TaskID: event.resourceIds[0],
			TaskName: event.title ?? '',
			StartTime: event.start,
			EndTime: event.end,
			IsAllDay: event.allDay ?? false
		};
	}

	function gen_tasks(tasks: Task[] = []) {
		let events = tasks.map(convert_task);

		return events;
	}

	type GetEvent = {
		start: string;
		end: string;
		resourceIds: number[];
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
		taskStore.updateTask(task);
	}

	$: task_models = tasks.map((task) => {
		return {
			id: task.TaskID,
			open: false
		};
	});

	$: events = gen_tasks(tasks);

	let plugins = [TimeGrid, Interaction];
	$: options = {
		view: 'timeGridWeek',
		events,
		eventDrop: update_callback,
		eventClick: (info: Info) => {
			let index = task_models.findIndex((task_model) => task_model.id == info.event.resourceIds[0]);
			task_models[index].open = true;
		}
	};
</script>

<div class="m-5 p-3 rounded-lg border-2 border-gray-200">
	<Calendar {plugins} {options} />
</div>

{#each task_models as task_model, index}
	{#if task_model.open}
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div class="bg-white p-5 rounded-lg">
            <div class="flex justify-between">
                <h1 class="text-2xl font-bold">Task</h1>
                <button on:click={() => task_models[index].open = false}>&times;</button>
            </div>
            <div class="flex flex-col">
                <input type="text" class="border-2 border-gray-200 p-2 rounded-lg" bind:value={tasks[index].TaskName} />
                <input type="datetime-local" class="border-2 border-gray-200 p-2 rounded-lg" bind:value={tasks[index].StartTime} />
                <input type="datetime-local" class="border-2 border-gray-200 p-2 rounded-lg" bind:value={tasks[index].EndTime} />
                <button class="bg-blue-500 text-white p-2 rounded-lg" on:click={() => taskStore.updateTask(tasks[index])}>Update</button>
            </div>
        </div>
    </div>
	{/if}
{/each}
