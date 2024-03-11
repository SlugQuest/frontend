<script lang="ts">
	export let catagory: string;
	import { categoryStore } from './categoryStore';

	function callBack() {
		if ($categoryStore === catagory) {
			console.log('clearing');
			categoryStore.clearCategory();
		} else {
			console.log('setting');
			categoryStore.setCategory(catagory);
		}
		console.log($categoryStore, catagory);
	}
</script>

<button class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100" on:click={callBack}>
	{#if $categoryStore === catagory}
		<span class="text-lg font-bold">#</span>
		<span class="font-bold">{catagory}</span>
	{:else}
		<span class="text-lg">#</span>
		<span>{catagory}</span>
	{/if}
</button>
