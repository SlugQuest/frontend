<script lang="ts">
	import LogOutButton from './LogOutButton.svelte';
	import AddTaskModel from './AddTaskModel.svelte';

	import Button from './components/ui/button/button.svelte';

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
		<Button variant="link" on:click={goToSocial}>Social Page</Button>
		{#if title === 'Calendar'}
			<Button variant="link" on:click={goToTaskCard}>Task Card View</Button>
		{:else}
			<Button variant="link" on:click={goToCalendar}>Calendar View</Button>
		{/if}
		<AddTaskModel />
		<LogOutButton />
	</div>
</header>
