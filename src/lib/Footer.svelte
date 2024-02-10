<script>
	let height = 25;
	let total_health = 600;
	let health_remaining = 100;
</script>

<footer class="flex items-center justify-between p-4 bg-white shadow-md">
	<p class="text-sm text-gray-600 dark:text-gray-400">© 2024 SlugQuest</p>
	<div class="flex items-center gap-4"></div>

	<div class="container">
		<div class="bar" style="width: {total_health}px; height: {height}px;"></div>
		<div class="health" style="width: {health_remaining}px; height: {height}px;"></div>
		<div class="text">Health: {health_remaining}/{total_health}</div>
	</div>
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
		top: -35px; /* Adjust the distance above the bar */
		font-weight: bold;
	}
</style>
