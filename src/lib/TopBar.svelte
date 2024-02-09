<script lang="ts">
    const BACKEND_URL = 'http://localhost:8080';

    import LogOutButton from './LogOutButton.svelte';
    import AddTask from './AddTask.svelte';
    
    export let title: string;
</script>

<header class="flex items-center justify-between p-4 bg-white shadow-md">
    <h1 class="text-2xl font-bold">{title}</h1>
    <div class="flex items-center gap-4">
        <AddTask />
        <LogOutButton />
    </div>
</header>