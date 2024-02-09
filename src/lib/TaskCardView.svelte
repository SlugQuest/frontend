<!-- TaskCardView.svelte -->
<script>
    const BACKEND_URL = 'http://localhost:8080';

    import { onMount } from 'svelte';
    import TaskCard from './TaskCard.svelte';
    let tasks = [];
    let tasksByCategory = {};

    onMount(async () => {
        const response = await fetch(`${BACKEND_URL}/api/v1/tasks`);
        tasks = await response.json();
        tasksByCategory = groupByCategory(tasks);
    });

    function groupByCategory(tasks) {
        return tasks.reduce((groups, task) => {
            const category = task.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(task);
            return groups;
        }, {});
    }
</script>

<section class="flex-1 overflow-auto">
    {#each Object.keys(tasksByCategory) as category}
        <div class="p-4">
            <h2 class="text-lg font-semibold mb-2">{category}</h2>
            <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {#each tasksByCategory[category] as task (task.id)}
                    <TaskCard {task} />
                {/each}
            </div>
        </div>
    {/each}
</section>