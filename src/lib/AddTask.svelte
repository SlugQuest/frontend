<script lang="ts">
	import { BACKEND_URL } from './BackendURL';
	import { taskStore, ResultEnum } from './taskStore';
	import type { CreateTask } from './taskStore';
	import { fetchPoints } from './points.ts';
	import { teamStore } from './teamStore';

	let showModal = false;
	let taskName = '';
	let taskDescription = '';
	let taskCategory = '';
	let taskStartTime = '';
	let taskEndTime = '';
	let taskIsRecurring = false;
	let taskIsAllDay = false;
	let taskDifficulty = '';
	let cronExpression = '';
	let TeamID = -1;

	const setDifficulty = (difficulty) => (taskDifficulty = difficulty);

	let taskNameError = '';
	let taskDescriptionError = '';
	let taskCategoryError = '';
	let taskStartTimeError = '';
	let taskEndTimeError = '';
	let taskDifficultyError = '';
	let taskIsRecurringError = '';

	let chronTemp = '';

	$: {
		taskNameError = taskName.trim() === '' ? 'Task name is required' : '';
		taskDescriptionError = taskDescription.trim() === '' ? 'Task description is required' : '';
		taskCategoryError = taskCategory.trim() === '' ? 'Task category is required' : '';
		taskStartTimeError = taskStartTime.trim() === '' ? 'Start time is required' : '';
		taskEndTimeError = taskEndTime.trim() === '' ? 'End time is required' : '';
		taskDifficultyError = taskDifficulty.trim() === '' ? 'Difficulty is required' : '';
		taskIsRecurringError =
			taskIsRecurring && chronTemp === '' ? 'Specify how often task recurs' : '';

		if (taskStartTime && taskEndTime) {
			const start = new Date(taskStartTime);
			const end = new Date(taskEndTime);
			if (start >= end) {
				taskEndTimeError = 'End time must be after start time';
			}
		}
	}

	function setCronExpr(expr) {
		chronTemp = expr;
	}

	function generateCronExpr(word) {
		let startTime = new Date(taskStartTime);

		let hour = startTime.getHours();
		let minute = startTime.getMinutes();
		let dayOfWeek = startTime.getDay();
		let dayOfMonth = startTime.getDate();
		// cron expr format: "{minutes} {hours} {day of month} {month} {day of week}"

		if (word === 'daily') {
			cronExpression = `${minute} ${hour} * * *`;
		} else if (word === 'weekly') {
			cronExpression = `${minute} ${hour} * * ${dayOfWeek}`;
		} else if (word === 'monthly') {
			cronExpression = `${minute} ${hour} ${dayOfMonth} * *`;
		}
	}

	function clearFields() {
		taskName = '';
		taskDescription = '';
		taskCategory = '';
		taskStartTime = '';
		taskEndTime = '';
		taskIsRecurring = false;
		taskIsAllDay = false;
		taskDifficulty = '';
		cronExpression = '';
		chronTemp = '';
		TeamID = -1;
	}

	function cancel() {
		clearFields();
		showModal = false;
	}

	async function addTask() {
		if (
			taskNameError ||
			taskStartTimeError ||
			taskEndTimeError ||
			taskDifficultyError ||
			taskIsRecurringError
		) {
			return;
		}

		generateCronExpr(chronTemp);

		console.log(`Cron expression: "${cronExpression}"`);

		const task = {
			Category: taskCategory,
			TaskName: taskName,
			Description: taskDescription,
			StartTime: taskStartTime + ':00Z',
			EndTime: taskEndTime + ':00Z',
			Status: 'todo',
			IsRecurring: taskIsRecurring,
			IsAllDay: taskIsAllDay,
			Difficulty: taskDifficulty,
			CronExpression: cronExpression,
			TeamID: TeamID
		};

		console.log({
			task
		});

		const response = await taskStore.addTask(task);
		if (response === ResultEnum.BadRequest) {
			console.error('Failed to add task', response);
		}

		// console.log({
		//     task
		// });

		clearFields();

		showModal = false;

		taskStore.prepareTasks();
		// taskStore.addTask(task);
	}
</script>

<button
	on:click={() => (showModal = true)}
	class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 ml-4 border border-gray-300"
>
	Add task
</button>
{#if showModal}
	<div
		class="fixed z-10 inset-0 overflow-y-auto"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
		>
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				aria-hidden="true"
			></div>
			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
				>&#8203;</span
			>
			<div
				class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
			>
				<div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
					<div class="sm:flex sm:items-start">
						<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
								Add a new task
							</h3>
							<div class="mt-2">
								<input
									bind:value={taskName}
									class="w-full px-2 py-1 border rounded-md"
									type="text"
									placeholder="Task name"
								/>
								{#if taskNameError}<p class="error text-left">{taskNameError}</p>{/if}
								<textarea
									bind:value={taskDescription}
									class="w-full px-2 py-1 border rounded-md mt-2"
									placeholder="Task description"
								></textarea>
								<!-- {#if taskDescriptionError}<p class="error">{taskDescriptionError}</p>{/if} -->
								<input
									bind:value={taskCategory}
									class="w-full px-2 py-1 border rounded-md mt-2"
									type="text"
									placeholder="Task category"
								/>
								<!-- {#if taskCategoryError}<p class="error">{taskCategoryError}</p>{/if} -->
								<input
									bind:value={taskStartTime}
									class="w-full px-2 py-1 border rounded-md mt-2"
									type="datetime-local"
									placeholder="Start time"
								/>
								{#if taskStartTimeError}<p class="error">{taskStartTimeError}</p>{/if}
								<input
									bind:value={taskEndTime}
									class="w-full px-2 py-1 border rounded-md mt-2"
									type="datetime-local"
									placeholder="End time"
								/>
								{#if taskEndTimeError}<p class="error">{taskEndTimeError}</p>{/if}
								<label>
									<input bind:checked={taskIsRecurring} type="checkbox" />
									Is recurring
								</label>
								{#if taskIsRecurring}
									<div class="mt-2">
										<div class="mt-2 flex">
											<button
												class="px-4 py-2 border rounded-l-md {chronTemp === 'daily'
													? 'bg-gray-300'
													: ''}"
												on:click={() => setCronExpr('daily')}>Daily</button
											>
											<button
												class="px-4 py-2 border-t border-b {chronTemp === 'weekly'
													? 'bg-gray-300'
													: ''}"
												on:click={() => setCronExpr('weekly')}>Weekly</button
											>
											<button
												class="px-4 py-2 border rounded-r-md {chronTemp === 'monthly'
													? 'bg-gray-300'
													: ''}"
												on:click={() => setCronExpr('monthly')}>Monthly</button
											>
										</div>
									</div>
									{#if taskIsRecurringError}<p class="error">{taskIsRecurringError}</p>{/if}
								{/if}
								<label>
									<input bind:checked={taskIsAllDay} type="checkbox" />
									Is all day
								</label>
								<div class="mt-2">
									<div class="mt-2 flex">
										<button
											on:click={() => setDifficulty('easy')}
											class="px-4 py-2 border rounded-l-md {taskDifficulty === 'easy'
												? 'bg-gray-300'
												: ''}">Easy</button
										>
										<button
											on:click={() => setDifficulty('medium')}
											class="px-4 py-2 border-t border-b {taskDifficulty === 'medium'
												? 'bg-gray-300'
												: ''}">Medium</button
										>
										<button
											on:click={() => setDifficulty('hard')}
											class="px-4 py-2 border rounded-r-md {taskDifficulty === 'hard'
												? 'bg-gray-300'
												: ''}">Hard</button
										>
									</div>
									{#if taskDifficultyError}<p class="error">{taskDifficultyError}</p>{/if}
								</div>
								<div class="mt-2">
									<select bind:value={TeamID} class="w-full px-2 py-1 border rounded-md mt-2">
										<option value={-1}>Individual Task</option>
										{#each $teamStore as team (team.TeamID)}
											<option value={team.TeamID}>{team.Name}</option>
										{/each}
									</select>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
					<button
						type="button"
						on:click={addTask}
						class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
					>
						Add task
					</button>
					<button
						type="button"
						on:click={cancel}
						class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.error {
		color: red;
	}
	.btn-group button {
		margin: 0 5px;
	}
	/* .error, input, textarea {
        width: 100%;
    } */
</style>
