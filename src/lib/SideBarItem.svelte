<script lang="ts">
	export let label: string;
  export let callback: () => void;
	import { categoryStore, filterStore } from './categoryStore';

</script>

<button class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100" on:click={callback}>
	{#if $categoryStore === label || $filterStore === label.toLowerCase()}
		<span class="font-bold">{label}</span>
	{:else}
		<span>{label}</span>
	{/if}
</button>
