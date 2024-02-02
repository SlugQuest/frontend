<script lang="ts">
    import AddTask from './AddTask.svelte';
    
    const BACKEND_URL = 'http://localhost:8080';

    export let title: string;
    // export let points: number;
    let showModal = false;
    
</script>

<header class="flex items-center justify-between p-4 bg-white shadow-md">
    <h1 class="text-2xl font-bold">{title}</h1>
    <div class="flex items-center gap-4">
        <AddTask />
    </div>
</header>
