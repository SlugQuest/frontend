<script>
	import { onMount } from 'svelte';
	import { BACKEND_URL } from './BackendURL';
	import { curr_health, user_points, boss_name, boss_image } from './store.ts';
	import { fetchPoints, getBossID } from './points.ts';
	let showModal = false;
	function viewBoss() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function startup() {
		console.log('startup');
		console.log('fetching boss id');
		getBossID();
		console.log('fetching points');
		fetchPoints();
	}

	onMount(startup);

	let currHealth;
	curr_health.subscribe((value) => {
		currHealth = value;
	});

	let userPoints;
	user_points.subscribe((value) => {
		userPoints = value;
	});

	let bossName;
	boss_name.subscribe((value) => {
		bossName = value;
	});

	let bossImage;
	boss_image.subscribe((value) => {
		bossImage = value;
	});

	let height = 25;
	let bar = 600;

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
	<button
		on:click={viewBoss}
		class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 ml-4 border border-gray-300"
		>View Boss</button
	>
</footer>

{#if showModal}
	<div
		class="fixed z-10 inset-0 overflow-y-auto"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
		>
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				aria-hidden="true"
			></div>
			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
				>&#8203;</span
			>
			<div
				class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
			>
				<div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
					<div class="sm:flex sm:items-start">
						<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
								{bossName}
							</h3>
							<img src={bossImage} alt="Boss image" class="mt-4" />
						</div>
						<button
							type="button"
							on:click={closeModal}
							class="inline-flex items-center justify-center h-8 w-8 border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							X
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal {
		/* Add your modal styles here */
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
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
