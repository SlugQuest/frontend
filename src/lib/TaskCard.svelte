<script lang="ts">
    import { BACKEND_URL } from './BackendURL';
    import { taskStore } from './taskStore';
    import { writable } from 'svelte/store';

    export let task: {
        TaskID: number;
        UserID: string;
        Category: string;
        TaskName: string;
        Description: string;
        StartTime: string;
        EndTime: string;
        Status: string;
        IsRecurring: boolean;
        IsAllDay: boolean;
        Difficulty: string;
        CronExpression: string;
    }

    let showModal = false;

    let editModal = writable(false);
    let editTask = {};

    function toggleModal() {
        showModal = !showModal;
    }

    async function deleteTask() {
        const response = await fetch(`${BACKEND_URL}/api/v1/task/${task.TaskID}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            console.error('Failed to delete task', response);
        }
        taskStore.prepareTasks();

    }

    async function completeTask() {
        const response = await fetch(`${BACKEND_URL}/api/v1/passtask/${task.TaskID}`, {
            method: 'POST',
            credentials: 'include',
        });
        taskStore.prepareTasks();
    }

    async function failTask() {
        const response = await fetch(`${BACKEND_URL}/api/v1/failtask/${task.TaskID}`, {
            method: 'POST',
            credentials: 'include',
        });
        taskStore.prepareTasks();
    }

    function formatFieldName(fieldName) {
        return fieldName
            .replace(/([A-Z])/g, ' $1') // insert a space before all capital letters
            .replace(/^./, function(str){ return str.toUpperCase(); }) // capitalize the first letter
    }

    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleString();
    }

    function openEditModal() {
        editTask = { ...task };
        editModal.set(true);
    }

    function closeEditModal() {
        editModal.set(false);
    }

    async function saveTask() {
        const response = await fetch(`${BACKEND_URL}/api/v1/task/${task.TaskID}`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (!response.ok) {
            console.error('Failed to edit task', response);
        }
        taskStore.prepareTasks();
        closeEditModal();
    }

    const fieldOrder = ['TaskName', 'Description', 'Category', 'StartTime', 'EndTime', 'IsRecurring', 'Status', 'IsAllDay', 'Difficulty'];

</script>

<button class="relative rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card" on:click={toggleModal}>
    <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
            {task.TaskName}
        </h3>
        <p class="text-sm text-muted-foreground">{task.Description}</p>
    </div>
</button>

{#if showModal}
    <div class="modal-background">
        <div class="modal-content">
            <button class="close-button" on:click={toggleModal}>X</button>
            {#each fieldOrder as field}
                <div class="task-field">
                    <label>{formatFieldName(field)}</label>
                    <p>{field === 'StartTime' || field === 'EndTime' ? formatDateTime(task[field]) : task[field]}</p>
                </div>
            {/each}
            <div class="button-group">
                <button class="delete-button" on:click={deleteTask}>Delete Task</button>
                <button class="fail-button" on:click={failTask}>Fail Task</button>
                <button class="complete-button" on:click={completeTask}>Complete Task</button>
                <button class="edit-button" on:click={openEditModal}>Edit Task</button>
            </div>
        </div>
    </div>
{/if}

{#if $editModal}
    <div class="modal-background">
        <div class="modal-content">
            <button class="close-button" on:click={closeEditModal}>X</button>
            {#each fieldOrder as field}
                {#if field !== 'Status'}
                    <div class="task-field">
                        {#if field === 'Difficulty'}
                            <label>{formatFieldName(field)}</label>
                            <div class="mt-2 flex">
                                <button on:click={() => editTask[field] = 'easy'} class="px-4 py-2 border rounded-l-md {editTask[field] === 'easy' ? 'bg-gray-300' : ''}">Easy</button>
                                <button on:click={() => editTask[field] = 'medium'} class="px-4 py-2 border-t border-b {editTask[field] === 'medium' ? 'bg-gray-300' : ''}">Medium</button>
                                <button on:click={() => editTask[field] = 'hard'} class="px-4 py-2 border rounded-r-md {editTask[field] === 'hard' ? 'bg-gray-300' : ''}">Hard</button>
                            </div>
                        {:else if field === 'StartTime' || field === 'EndTime'}
                            <label>{formatFieldName(field)}</label>
                            <input bind:value={editTask[field]} class="w-full px-2 py-1 border rounded-md mt-2" type="datetime-local" />
                        {:else if field === 'IsAllDay' || field === 'IsRecurring'}
                            <label class="checkbox-label">
                                {formatFieldName(field)}
                                <input type="checkbox" bind:checked={editTask[field]} />
                            </label>
                        {:else}
                            <label>{formatFieldName(field)}</label>
                            <input class="input-field" bind:value={editTask[field]} />
                        {/if}
                    </div>
                {/if}
            {/each}
            <button class="save-button" on:click={saveTask}>Save Task</button>
        </div>
    </div>
{/if}

<style>
    .checkbox-label {
        display: flex;
        align-items: center;
    }

    .checkbox-label input[type="checkbox"] {
        margin-left: 10px;
    }

    .input-field {
        border: 1px solid #ccc;
        padding: 10px;
        margin: 5px 0;
        width: 100%;
        box-sizing: border-box;
    }
    .modal-background {
        z-index:1000;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 10px;
        position: relative; /* Add this to position the close button relative to the modal content */
    }

    .label {
        font-weight: bold;
        font-size: 1.2em;
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 20px;
        color: lightgrey;
        cursor: pointer;
    }
    .delete-button {
        background-color: red;
        color: white;
        border: none;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 20px 2px;
        cursor: pointer;
        border-radius: 5px;
    }

    .button-group {
        display: flex;
        justify-content: space-between;
    }

    .fail-button, .complete-button {
        background-color: #f44336; /* Red */
        color: white;
        border: none;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 20px 2px;
        cursor: pointer;
        border-radius: 5px;
    }

    .complete-button {
        background-color: #4CAF50; /* Green */
    }

    .edit-button {
        background-color: lightgrey; /* Light Grey */
        color: black;
        border: none;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 20px 2px;
        cursor: pointer;
        border-radius: 5px;
    }

    .save-button {
        background-color: #4CAF50; /* Green */
        color: white;
        border: none;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 20px 2px;
        cursor: pointer;
        border-radius: 5px;
    }
</style>