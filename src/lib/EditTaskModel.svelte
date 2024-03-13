<script lang="ts">
	export let taskID: number;
	export let show: boolean;

	import * as Dialog from '$lib/components/ui/dialog';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import { taskStore } from './taskStore';
	import type { Task } from '$lib/taskStore';
	import { categoryStore } from './categoryStore';
	import DeleteModel from './DeleteModel.svelte';

	let task: Task | undefined = undefined;

	taskStore.subscribe((value) => {
		let inner_task = value.find((t) => t.TaskID === taskID) ?? task;
		task = inner_task === undefined ? undefined : { ...inner_task };
	});

	function updateTask() {
		if (task === undefined) return;
		taskStore.updateTask(task);
	}

	function deleteTask() {
		if (task === undefined) return;
		taskStore.removeTask(taskID);
	}

	let badDatetime = false;
	$: {
		if (task !== undefined) {
			badDatetime = new Date(task.StartTime) > new Date(task.EndTime);
		}
	}

	$: {
		if (show === false) {
			task = taskStore.getTask(taskID);
		}
	}

	const difficulties = [
		{ value: 'easy', label: 'Easy' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'hard', label: 'Hard' }
	];

	$: difficulty = difficulties.find((d) => d.value === task?.Difficulty) ?? undefined;

	let catagories: { value: string; label: string }[] = [];
	taskStore.subscribe((value) => {
		let catagories_inner = Array.from(new Set(value.map((task) => task.Category)));
		catagories = catagories_inner.map((c) => {
			return {
				value: c,
				label: c
			};
		});
	});

  let showDeleteModal = false;
</script>

{#if task !== undefined}
	<Dialog.Root bind:open={show}>
		<Dialog.Content>
			<Dialog.Title>Edit Task</Dialog.Title>
			<div>
				<Label for="taskName">Task Name</Label>
				<Input id="taskName" bind:value={task.TaskName} />
			</div>
			<div>
				<Label for="taskDescription">Task Description</Label>
				<Input id="taskDescription" bind:value={task.Description} />
			</div>
			<Separator />
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="taskIsAllDay" class="text-right">Is All Day</Label>
				<Checkbox id="taskIsAllDay" bind:checked={task.IsAllDay} />
			</div>
			{#if !task.IsAllDay}
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="taskStartTime" class="text-right">Start Date:</Label>
					<Input
						id="taskStartTime"
						class="col-span-3"
						type="datetime-local"
						bind:value={task.StartTime}
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="taskEndTime" class="text-right">End Date:</Label>
					<Input
						id="taskEndTime"
						class="col-span-3"
						type="datetime-local"
						bind:value={task.EndTime}
					/>
				</div>
				{#if badDatetime}
					<Alert.Root variant="destructive">
						<Alert.Title>Bad Datetime</Alert.Title>
						<Alert.Description>Start time cannot be after end time</Alert.Description>
					</Alert.Root>
				{/if}
			{/if}
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="taskDifficulty" class="text-right">Task Difficulty</Label>
				<Select.Root
					bind:selected={difficulty}
					onSelectedChange={(value) => {
						if (task !== undefined) {
							task.Difficulty = value?.value ?? task.Difficulty;
						}
					}}
				>
					<Select.Trigger class="col-span-3">
						<Select.Value placeholder="Select a difficulty" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Difficulties</Select.Label>
							{#each difficulties as difficulty}
								<Select.Item value={difficulty.value} label={difficulty.label}
									>{difficulty.label}</Select.Item
								>
							{/each}
						</Select.Group>
					</Select.Content>
					<Select.Input name="taskDifficulty" />
				</Select.Root>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="taskDifficulty" class="text-right">Catagory</Label>
				<Input id="taskCatagory" class="col-span-3" bind:value={task.Category} />
			</div>
			<Button on:click={updateTask}>Update</Button>
      <Button variant="destructive" on:click={() => showDeleteModal = true}>Delete</Button>
		</Dialog.Content>
	</Dialog.Root>
  <DeleteModel bind:show={showDeleteModal} task={task} />
{/if}
