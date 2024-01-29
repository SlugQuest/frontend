<script lang="ts">
	export let title: string;
</script>

<aside class="w-64 border-r dark:border-gray-700 overflow-auto">
	<h2 class="px-4 py-2 text-lg font-semibold border-b dark:border-gray-700">
		{title}
	</h2>
	<nav class="flex flex-col gap-1 px-4 py-2">
		<slot />
	</nav>
</aside>
