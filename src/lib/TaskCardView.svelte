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

{#each Object.keys(tasksByCategory) as category}
    <h2>{category}</h2>
    {#each tasksByCategory[category] as task (task.id)}
        <TaskCard {task} />
    {/each}
{/each}