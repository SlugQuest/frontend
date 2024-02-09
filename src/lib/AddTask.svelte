<script lang="ts">
    import { BACKEND_URL } from './BackendURL';
    import prepareTasks from './TaskCardView.svelte';

    let showModal = false;
    let taskName = '';
    let taskDescription = '';

    async function addTask() {
        const task = {
            UserID: "user123",
            Category: "Work",
            TaskName: taskName,
            Description: taskDescription,
            StartTime: "2024-01-01T17:00:00Z",
            EndTime: "2024-01-01T17:00:00Z",
            IsCompleted: false,
            IsRecurring: false,
            IsAllDay: false
        };

        const response = await fetch(`${BACKEND_URL}/api/v1/task`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ task })
        });
        if (!response.ok) {
            console.error('Failed to add task', response);
        }

        taskName = '';
        taskDescription = '';
        showModal = false;

        prepareTasks();
    }
</script>

<button on:click={() => showModal = true} class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 ml-4 border border-gray-300">
    Add task
</button>
{#if showModal}
<div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            Add a new task
                        </h3>
                        <div class="mt-2">
                            <input bind:value={taskName} class="w-full px-2 py-1 border rounded-md" type="text" placeholder="Task name" />
                            <textarea bind:value={taskDescription} class="w-full px-2 py-1 border rounded-md mt-2" placeholder="Task description"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" on:click={addTask} class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Add task
                </button>
                <button type="button" on:click={() => showModal = false} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div>
{/if}