<script lang="ts">
	import LogOutButton from './LogOutButton.svelte';
	import AddTaskModel from './AddTaskModel.svelte';
	import AddTask from './AddTask.svelte';

	export let title: string;
    function goToSocial() {
        window.location.href = '/loggedin/social';
    }
    function goToCalendar() {
        window.location.href = '/calendar';
    }
    function goToTaskCard() {
        window.location.href = '/loggedin';
    }
</script>

<header class="flex items-center justify-between p-4 bg-white shadow-md">
    <h1 class="text-2xl font-bold">{title}</h1>
    <div class="flex items-center gap-4">
        <button on:click={goToSocial} class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 ml-4 border border-gray-300">
            Social Page
        </button>
        {#if title === 'Calendar'}
        <button on:click={goToTaskCard} class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 ml-4 border border-gray-300">
            Task Card View
        </button>
        {:else}
        <button on:click={goToCalendar} class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 ml-4 border border-gray-300">
            Calendar View
        </button>
        {/if}
        <AddTask />
        <AddTaskModel />
        <LogOutButton />
    </div>
</header>

