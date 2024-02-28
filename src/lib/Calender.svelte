<script lang="ts">
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import Interaction from '@event-calendar/interaction';
	import { taskStore } from './taskStore';
	import type { Task } from '$lib/taskStore';
	import { onMount } from 'svelte';
	import EditTaskModel from './EditTaskModel.svelte';

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
    console.log(event);
    let index_int = parseInt(event.resourceIds[0]);
		let prev_task = taskStore.getTask(index_int);
    if (prev_task === undefined) {
      console.log('Task not found');
      return;
    }
    let start = new Date(event.start).toISOString();
    start = start.replace('.000', '');
    let end = new Date(event.end).toISOString();
    end = end.replace('.000', '');
    console.log(start, end);
		return {
      ...prev_task,
			TaskID: index_int,
			StartTime: start,
			EndTime: end,
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
      let task = convert_event(info.event);
      if (task === undefined) {
        console.log('Task not found');
        return;
      }
      if (task.IsRecurring) {
        console.log('Recurring task');
        return;
      }
			task_models[index].open = true;
		}
	};
</script>

<div class="m-5 p-3 rounded-lg border-2 border-gray-200">
	<Calendar {plugins} {options} />
</div>

{#each task_models as task_model}
	<EditTaskModel taskID={task_model.id} bind:show={task_model.open} />
{/each}
