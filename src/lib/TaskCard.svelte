<script lang="ts">
    export let title: string;
    export let description: string;
    export let task_id: number;

    const BACKEND_URL = 'http://localhost:8080';

    async function deleteTask() {
        const response = await fetch(`${BACKEND_URL}/main/blah/tasks/${task_id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            console.error('Failed to delete task', response);
        }
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
            {title}
        </h3>
        <p class="text-sm text-muted-foreground">{description}</p>
    </div>
</div>