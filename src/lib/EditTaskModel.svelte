<script lang="ts">
  export let taskID: number;
  export let show: boolean;

	import { taskStore } from './taskStore';
	import type { Task } from '$lib/taskStore';

  let task: Task | undefined = undefined;

  taskStore.subscribe((value) => {
    task = value.find((t) => t.TaskID === taskID) ?? task;
  });

  function updateTask() {
    if (task === undefined) return;
    taskStore.updateTask(task);
  }

  function deleteTask() {
    if (task === undefined) return;
    taskStore.removeTask(taskID);
  }
</script>

{#if task !== undefined}
  {#if show}
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div class="bg-white p-4 rounded-lg">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Edit Task</h1>
          <button class="text-red-500" on:click={() => show = false}>X</button>
        </div>
        <div class="flex flex-col gap-4">
          <input type="text" class="border-2 border-gray-300 p-2" bind:value={task.TaskName} />
          <input type="datetime-local" class="border-2 border-gray-300 p-2" bind:value={task.StartTime} />
          <input type="datetime-local" class="border-2 border-gray-300 p-2" bind:value={task.EndTime} />
          <input type="checkbox" class="border-2 border-gray-300 p-2" bind:checked={task.IsAllDay} />
          <button class="bg-blue-500 text-white p-2 rounded-lg" on:click={updateTask}>Update</button>
          <button class="bg-red-500 text-white p-2 rounded-lg" on:click={deleteTask}>Delete</button>
        </div>
      </div>
  </div>
  {/if}
{/if}
