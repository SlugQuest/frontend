<script lang="ts">
    import { BACKEND_URL } from './BackendURL';
    import { taskStore } from './taskStore';
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
</script>

<div class="relative rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
    <button 
        on:click={deleteTask} 
        class="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
    >
        X
    </button>
    <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
            {task.TaskName}
        </h3>
        <p class="text-sm text-muted-foreground">{task.Description}</p>
    </div>
</div>