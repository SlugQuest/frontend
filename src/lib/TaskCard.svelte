<script lang="ts">
	import { BACKEND_URL } from './BackendURL';
	import { taskStore, type Task } from './taskStore';
	import { fetchPoints, fetchBossImage } from './points';
	import { boss_ID } from './store';

	// This is a long description of the task
	// It is a long description of the task
	// It is a long description of the task

	import * as ContextMenu from '$lib/components/ui/context-menu';
	import * as Card from '$lib/components/ui/card';
	import DeleteModel from './DeleteModel.svelte';
	import TaskCardModel from './TaskCardModel.svelte';

	export let task: Task;

	let bossID: number;
	boss_ID.subscribe((value) => {
		bossID = value;
	});

	let showNewModal = false;
	let editNewModal = false;
	let showDeleteModal = false;

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
		<ContextMenu.Item
			on:click={() => {
				editNewModal = true;
			}}>Edit</ContextMenu.Item
		>
		<ContextMenu.Item on:click={deleteTask}>Delete</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>

<TaskCardModel show={showNewModal} task={task} />
<DeleteModel show={showDeleteModal} task={task} />
