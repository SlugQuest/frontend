<!-- TaskCardView.svelte -->
<script>
	import { BACKEND_URL } from './BackendURL';
	import { taskStore } from './taskStore';

	import { onMount } from 'svelte';
	import TaskCard from './TaskCard.svelte';

	import { teamStore } from './teamStore';

	import { categoryStore, filterStore } from './categoryStore';

	onMount(async () => {
		taskStore.prepareTasks();
		teamStore.prepareTeams();
	});
	taskStore.subscribe((value) => console.log(value));

	for (const task of $taskStore) {
		console.log(task);
	}

	/**
	 * @typedef {import('./taskStore').Task} Task
	 * @type {(arg0: Task) => boolean}
	 */
	$: checkFilter = (task) => {
		console.log($categoryStore);
		if ($filterStore === 'complete') {
			return task.Status === 'completed';
		} else if (task.Status === 'completed') {
			return false;
		} else if ($filterStore === 'recurring') {
			return task.IsRecurring;
		} else if ($filterStore === 'non-recurring') {
			return !task.IsRecurring;
		} else if ($filterStore === 'team') {
			return task.TeamID !== -1;
		} else if ($filterStore === 'personal') {
			return task.TeamID === -1;
		} else if ($categoryStore === task.Category) {
			return true;
		} else if ($categoryStore === undefined) {
			return true;
		} else {
			return false;
		}
	};
</script>

<section class="flex-1 overflow-auto">
	<div class="p-4">
		<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
			{#if Array.isArray($taskStore) && $taskStore.length > 0}
				{#each $taskStore as task (task.TaskID)}
					{#if checkFilter(task)}
						<TaskCard {task} />
					{/if}
				{/each}
			{:else}
				<p>No tasks to display</p>
			{/if}
		</div>
	</div>
</section>
