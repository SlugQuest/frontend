<script lang="ts">
	export let path: string;
	export let name: string;
</script>

<a
	class="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
	href={path}
>
	<slot />
	<span>{name}</span>
</a>
