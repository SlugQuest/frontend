<script lang="ts">
	import { BACKEND_URL } from './BackendURL';
	import { taskStore, ResultEnum} from './taskStore';
    import type { CreateTask } from './taskStore';
	import { fetchPoints } from './points.ts';
    import { teamStore } from './teamStore';

  import * as Dialog from "$lib/components/ui/dialog";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import * as Alert from "$lib/components/ui/alert";
  import * as Select from "$lib/components/ui/select";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Button } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Textarea } from "$lib/components/ui/textarea";

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

    const setDifficulty = (difficulty) => taskDifficulty = difficulty;

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
        taskIsRecurringError = (taskIsRecurring && (chronTemp === '')) ? 'Specify how often task recurs' : '';
        console.log('ChronTemp:', chronTemp);

        if (taskStartTime && taskEndTime) {
            const start = new Date(taskStartTime);
            const end = new Date(taskEndTime);
            if (start >= end) {
                taskEndTimeError = 'End time must be after start time';
            }
        }
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
        if (taskNameError || taskStartTimeError || taskEndTimeError || taskDifficultyError || taskIsRecurringError) {
            return;
        }

        generateCronExpr(chronTemp);

        console.log(`Cron expression: "${cronExpression}"`);

        const task = {
            Category: taskCategory,
            TaskName: taskName,
            Description: taskDescription,
            StartTime: taskStartTime + ":00Z",
            EndTime: taskEndTime + ":00Z",
            Status: "todo",
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

<Button on:click={() => showModal = true}>Add Task</Button>

<Dialog.Root bind:open={showModal}>
  <Dialog.Content>
    <Dialog.Title>Add Task</Dialog.Title>
    <div>
      <Label for="taskName">Task Name</Label>
      <Input id="taskName" bind:value={taskName} />
      {#if taskNameError}
        <Alert.Root variant="destructive" class="top-2 p-2">
          <Alert.Description>{taskNameError}</Alert.Description>
        </Alert.Root>
      {/if}
    </div>
    <div>
      <Label for="taskDescription">Task Description</Label>
      <Textarea id="taskDescription" bind:value={taskDescription} />
    </div>
    <Separator />
    <h3 class="text-xl font-bold">Time</h3>
    <div class="grid grid-cols-4 items-center gap-4">
        <Label for="taskIsAllDay" class="text-right">Is All Day</Label>
        <Checkbox id="taskIsAllDay" bind:checked={taskIsAllDay} />
    </div>
    {#if !taskIsAllDay}
      <div>
        <div class="grid grid-cols-4 items-center gap-4 ">
          <Label for="taskStartTime" class="text-right">Start Time</Label>
          <Input id="taskStartTime" type="datetime-local" class="col-span-3" bind:value={taskStartTime} />
        </div>
        {#if taskStartTimeError}
          <Alert.Root variant="destructive" class="top-2 p-2">
            <Alert.Description>{taskStartTimeError}</Alert.Description>
          </Alert.Root>
        {/if}
      </div>
      <div>
        <div class="grid grid-cols-4 items-center gap-4 ">
          <Label for="taskEndTime" class="text-right">End Time</Label>
          <Input id="taskEndTime" type="datetime-local" class="col-span-3" bind:value={taskEndTime} />
        </div>
        {#if taskEndTimeError}
          <Alert.Root variant="destructive" class="top-2 p-2">
            <Alert.Description>{taskEndTimeError}</Alert.Description>
          </Alert.Root>
        {/if}
      </div>
    {/if}
    <Separator />
    <h3 class="text-xl font-bold">Recurring</h3>
    <div class="grid grid-cols-4 items-center gap-4">
      <Label for="taskIsRecurring" class="text-right">Is Recurring</Label>
      <Checkbox id="taskIsRecurring" bind:checked={taskIsRecurring} />
    </div>
    {#if taskIsRecurring}
      <div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="taskRecurring" class="text-right">Recurring</Label>
          <Select.Root id="taskRecurring" bind:value={chronTemp} onSelectedChange={(value) => {
              chronTemp = value?.value;
          }}>
            <Select.Trigger class="col-span-3">
              <Select.Value placeholder="Select a recurring option" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="daily">Daily</Select.Item>
              <Select.Item value="weekly">Weekly</Select.Item>
              <Select.Item value="monthly">Monthly</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
        {#if taskIsRecurringError}
          <Alert.Root variant="destructive" class="top-2 p-2">
            <Alert.Description>{taskIsRecurringError}</Alert.Description>
          </Alert.Root>
        {/if}
      </div>
    {/if}
    <Separator />
    <div class="grid grid-cols-4 items-center gap-4">
      <Label for="taskCategory" class="text-right">Category</Label>
      <Input id="taskCategory" class="col-span-3" bind:value={taskCategory} />
    </div>
    <div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="taskDifficulty" class="text-right">Difficulty</Label>
        <Select.Root
          id="taskDifficulty"
          bind:value={taskDifficulty}
          onSelectedChange={(value) => {setDifficulty(value?.value)}}
        >
          <Select.Trigger class="col-span-3">
            <Select.Value placeholder="Select a difficulty" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="easy">Easy</Select.Item>
            <Select.Item value="medium">Medium</Select.Item>
            <Select.Item value="hard">Hard</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      {#if taskDifficultyError}
        <Alert.Root variant="destructive" class="top-2 p-2">
          <Alert.Description>{taskDifficultyError}</Alert.Description>
        </Alert.Root>
      {/if}
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
      <Label for="taskTeam" class="text-right">Team</Label>
      <Select.Root
        selected={{
          value: TeamID,
          label: TeamID === -1 ? 'Personal' : $teamStore.find((team) => team.TeamID === TeamID)?.Name
        }}
        onSelectedChange={(value) => {
          console.log(value);
          if (!value) {
            TeamID = -1;
          } else {
            TeamID = value.value;
          }
        }}
      >
        <Select.Trigger class="col-span-3">
          <Select.Value placeholder="Select a team" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value={-1}>Personal</Select.Item>
          {#each $teamStore as team (team.TeamID)}
            <Select.Item value={team.TeamID}>{team.Name}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
    <Separator />
    <div class="flex justify-end gap-4">
      <Button variant="secondary" on:click={cancel}>Cancel</Button>
      <Button on:click={addTask}>Add Task</Button>
    </div>
  </Dialog.Content>
</Dialog.Root>
