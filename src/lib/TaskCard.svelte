<script lang="ts">
	import { BACKEND_URL } from './BackendURL';
	import { taskStore, type Task } from './taskStore';
	import { writable } from 'svelte/store';
	import { fetchPoints, fetchBossImage } from './points.ts';
	import { boss_ID } from './store';
	import { teamStore } from './teamStore';

	// This is a long description of the task
	// It is a long description of the task
	// It is a long description of the task

	import * as Dialog from '$lib/components/ui/dialog';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import * as Card from '$lib/components/ui/card';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Alert from '$lib/components/ui/alert';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import Clock from 'svelte-radix/Clock.svelte';
	import Calendar from 'svelte-radix/Calendar.svelte';
	import EditTaskModel from './EditTaskModel.svelte';

	export let task: Task;

	let bossID: number;
	boss_ID.subscribe((value) => {
		bossID = value;
	});

	let showNewModal = false;
	let editNewModal = false;
  let showDeleteModal = false;

  async function actuallyDeleteTask() {
		const response = await fetch(`${BACKEND_URL}/api/v1/task/${task.TaskID}`, {
			method: 'DELETE',
			credentials: 'include'
		});

		if (!response.ok) {
			console.error('Failed to delete task', response);
		}
		taskStore.prepareTasks();
  }

	async function deleteTask() {
    showDeleteModal = true;
	}

	async function completeTask() {
		if (!(task.Status === 'completed')) {
			const response = await fetch(`${BACKEND_URL}/api/v1/passtask/${task.TaskID}`, {
				method: 'POST',
				credentials: 'include'
			});

			if (response.ok) {
				const data = await response.json();
				console.log(data);
				let id = data.bossId;
				boss_ID.set(id);
				fetchBossImage();
				console.log('PASSING TASK AND CHECKING BOSS ID Boss ID: ' + id);
			} else {
				console.error('Failed to complete task', response);
			}

			taskStore.prepareTasks();
			fetchPoints();
		}
	}

	async function failTask() {
		if (!(task.Status === 'failed')) {
			const response = await fetch(`${BACKEND_URL}/api/v1/failtask/${task.TaskID}`, {
				method: 'POST',
				credentials: 'include'
			});
			taskStore.prepareTasks();
			fetchPoints();
		}
	}

	function formatDateTime(dateTime: string | null): string | null {
		if (dateTime) {
			// let formattedDateTime = dateTime.substring(0, dateTime.length - 4);
			return dateTime.replace('T', ' ');
		}
		return null;
	}

	function addSuffixToDay(day: number): string {
		if (day % 10 == 1 && day != 11) {
			return day + 'st';
		} else if (day % 10 == 2 && day != 12) {
			return day + 'nd';
		} else if (day % 10 == 3 && day != 13) {
			return day + 'rd';
		} else {
			return day + 'th';
		}
	}

	function cronToString(cron: string): string {
		const [minute, hour, dayOfMonth, month, dayOfWeek] = cron.split(' ');
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

		let result = '';

		if (dayOfWeek !== '*') {
			result = `Every ${days[+dayOfWeek]} at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
		} else if (dayOfMonth !== '*') {
			result = `On the ${addSuffixToDay(+dayOfMonth)} day of every month at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
		} else {
			result = `Every day at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
		}

		return result;
	}
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<button
      class="w-full h-full"
			on:click={() => {
				showNewModal = true;
			}}
		>
      <Card.Root class="w-full h-full p-5">
        <Card.Title tag="h1" class="mb-2">{task.TaskName}</Card.Title>
        <Card.Description>{task.Description}</Card.Description>
      </Card.Root>
		</button>
	</ContextMenu.Trigger>
	<ContextMenu.Content>
    <ContextMenu.Item class="text-green-500" on:click={completeTask}>Complete</ContextMenu.Item>
    <ContextMenu.Item class="text-red-500" on:click={failTask}>Fail</ContextMenu.Item>
		<ContextMenu.Item on:click={() => {
      editNewModal = true;
    }}>Edit</ContextMenu.Item>
		<ContextMenu.Item on:click={deleteTask}>Delete</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>

<Dialog.Root bind:open={showNewModal}>
	<Dialog.Content>
		<Dialog.Title class="flex justify-between mt-3">
			{task.TaskName}
			<div>
				<Badge
					class={`mr-3 ${task.Status === 'completed' ? 'bg-green-500' : task.Status === 'failed' ? 'bg-red-500' : 'bg-gray-500'}`}
				>
					{task.Status}
				</Badge>
				<Badge
					class={`mr-3 ${task.Difficulty === 'easy' ? 'bg-green-500' : task.Difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}
				>
					{task.Difficulty}
				</Badge>
				<div></div>
			</div></Dialog.Title
		>
		<Dialog.Description>
			{task.Description}
		</Dialog.Description>
		<div class="grid grid-cols-4 items-center gap-4">
			<Label class="justify-start flex">
				<Clock />
				<span class="ml-2 my-auto">Start Time:</span>
			</Label>
			<span class="col-span-3">{formatDateTime(task.StartTime)}</span>
		</div>
		<div class="grid grid-cols-4 items-center gap-4">
			<Label class="justify-start flex">
				<Clock />
				<span class="ml-2 my-auto">End Time:</span>
			</Label>
			<span class="col-span-3">{formatDateTime(task.EndTime)}</span>
		</div>
		<div class="grid grid-cols-4 items-center gap-4">
			<Label class="justify-start flex">
				<Calendar />
				<span class="ml-2 my-auto">All Day:</span>
			</Label>
			{#if task.IsAllDay}
				<span class="col-span-3">Yes</span>
			{:else}
				<span class="col-span-3">No</span>
			{/if}
		</div>
		<div class="grid grid-cols-4 items-center gap-4">
			<Label class="justify-start flex">
				<Calendar />
				<span class="ml-2 my-auto">Recurring:</span>
			</Label>
			{#if task.IsRecurring}
				<span class="col-span-3">{cronToString(task.CronExpression)}</span>
			{:else}
				<span class="col-span-3">No</span>
			{/if}
		</div>
		{#if task.TeamID != -1}
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="justify-start flex">
					<Calendar />
					<span class="ml-2 my-auto">Team:</span>
				</Label>
				<span class="col-span-3"
					>{($teamStore.find((team) => team.TeamID === task.TeamID) || {}).Name}</span
				>
			</div>
		{/if}
		<div class="flex w-full gap-2">
			<Button class="bg-red-500 w-full" on:click={failTask}>Fail Task</Button>
			<Button class="bg-green-500 w-full" on:click={completeTask}>Complete Task</Button>
		</div>
		<Button
			class="bg-gray-500"
			on:click={() => {
				editNewModal = true;
			}}>Edit Task</Button
		>
	</Dialog.Content>
</Dialog.Root>

<EditTaskModel bind:show={editNewModal} taskID={task.TaskID} />

<AlertDialog.Root bind:open={showDeleteModal}>
  <AlertDialog.Content>
    <AlertDialog.Title>Delete Task</AlertDialog.Title>
    <AlertDialog.Description>Are you sure you want to delete this task?</AlertDialog.Description>
    <div class="flex w-full gap-2">
      <Button variant="destructive" class="w-full" on:click={actuallyDeleteTask}>Yes</Button>
      <Button variant="default" class="w-full" on:click={() => (showDeleteModal = false)}>No</Button>
    </div>
  </AlertDialog.Content>
</AlertDialog.Root>
