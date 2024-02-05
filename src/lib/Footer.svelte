<script>
	let height = 25
	let total_health = 600
	let health_remaining = 100
</script>

<style>


.container {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center; 
		align-items: center;
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
</style>


<footer class="flex items-center justify-between p-4 bg-white shadow-md">
	<p class="text-sm text-gray-600 dark:text-gray-400">© 2024 SlugQuest</p>
	<div class="flex items-center gap-4">
	</div>

	<div class="container">
		<div class = "bar" style="width: {total_health}px; height: {height}px;"> </div>
		<div class="health" style="width: {health_remaining}px; height: {height}px;"></div>
		
	</div>
</footer>
