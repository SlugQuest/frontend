<script lang="ts">
	import { BACKEND_URL } from './BackendURL';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { taskStore, type Task } from './taskStore';

  export let show = false;
  export let task: Task;

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

</script>

<AlertDialog.Root bind:open={show}>
	<AlertDialog.Content>
		<AlertDialog.Title>Delete Task</AlertDialog.Title>
		<AlertDialog.Description>Are you sure you want to delete this task?</AlertDialog.Description>
		<div class="flex w-full gap-2">
			<Button variant="destructive" class="w-full" on:click={actuallyDeleteTask}>Yes</Button>
			<Button variant="default" class="w-full" on:click={() => (show = false)}>No</Button>
		</div>
	</AlertDialog.Content>
</AlertDialog.Root>
