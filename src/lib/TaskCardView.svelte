<!-- TaskCardView.svelte -->
<script>
    import { BACKEND_URL } from './BackendURL';
    import { taskStore } from './taskStore';

    import { onMount } from 'svelte';
    import TaskCard from './TaskCard.svelte';

    import { categoryStore } from './categoryStore';

    onMount(async () => {
        taskStore.prepareTasks();
    });
    taskStore.subscribe(value => console.log(value));
    
</script>

<section class="flex-1 overflow-auto">
    <div class="p-4">
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {#if Array.isArray($taskStore) && $taskStore.length > 0}
                {#each $taskStore as task (task.TaskID)}
                  {#if $categoryStore === task.Category}
                    <TaskCard {task} />
                  {:else if $categoryStore === undefined}
                    <TaskCard {task} />
                  {/if}
                {/each}
            {:else}
                <p>No tasks to display</p>
            {/if}
        </div>
    </div>
</section>
