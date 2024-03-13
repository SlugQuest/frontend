<script lang="ts">

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
	import { BACKEND_URL } from './BackendURL';
	import { taskStore, type Task } from './taskStore';
	import { fetchPoints, fetchBossImage } from './points';
	import { boss_ID } from './store';

	import { teamStore } from './teamStore';

  export let task: Task;
  export let show = false;

  let editModel = false;

	function formatDateTime(dateTime: string | null): string | null {
		if (dateTime) {
			// let formattedDateTime = dateTime.substring(0, dateTime.length - 4);
			return dateTime.replace('T', ' ');
		}
		return null;
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
</script>

<Dialog.Root bind:open={show}>
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
				editModel = true;
			}}>Edit Task</Button
		>
	</Dialog.Content>
</Dialog.Root>

<EditTaskModel bind:show={editModel} taskID={task.TaskID} />

