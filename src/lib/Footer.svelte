<script>
	import { onMount } from 'svelte';
	import { BACKEND_URL } from './BackendURL';
	import { curr_health, user_points } from './store.ts';
	import { fetchPoints } from './points.ts';

	onMount(fetchPoints);

	let currHealth;
	curr_health.subscribe((value) => {
		currHealth = value;
	});

	let userPoints;
	user_points.subscribe((value) => {
		userPoints = value;
	});

	let height = 25;
	let bar = 600;
	// let x = 0;
	// let y = 0;
	// $: x = userPoints;
	// console.log(x);

	// $: y = currHealth;
	// console.log(y);

	console.log(userPoints);
	console.log(currHealth);

	$: total_health = userPoints + currHealth;
	$: health_bar = bar * (currHealth / total_health);
</script>

<footer class="flex items-center justify-between p-4 bg-white shadow-md h-20">
	<p class="text-sm text-gray-600 dark:text-gray-400">© 2024 SlugQuest</p>
	<div class="flex items-center gap-4"></div>

	<div class="container">
		<div class="bar" style="width: {bar}px; height: {height}px;"></div>
		<div class="health" style="width: {health_bar}px; height: {height}px;"></div>
		<div class="text">Health: {currHealth}/{userPoints + currHealth}</div>
	</div>
	 <!-- <button on:click={fetchPoints}>Update Points</button> -->
</footer>

<style>
	.container {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column; /* Added to stack elements vertically */
	}

	.health {
		background-color: red;
		position: absolute;
		border: 3px solid black;
		border-radius: 25px;
	}

	.bar {
		background-color: darkgray;
		position: absolute;
		border: 3px solid black;
		border-radius: 25px;
	}

	.text {
		position: absolute;
		top: 10px; /* Adjust the distance above the bar */
		font-weight: bold;
	}
</style>
