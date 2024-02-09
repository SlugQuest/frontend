<script>
	import Footer from './Footer.svelte';
	import SideBar from './SideBar.svelte';
	import SideBarItem from './SideBarItem.svelte';
	import TaskCard from './TaskCard.svelte';
	import TopBar from './TopBar.svelte';
</script>

<main class="flex flex-col h-screen bg-white">
	<TopBar title="Could be whatever?"/>
	<section class="flex flex-1 overflow-hidden">
		<SideBar title="Categories">
			<SideBarItem path="/" name="Work">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-5 w-5"
				>
					<rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
					<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
				</svg>
			</SideBarItem>
			<SideBarItem path="/school" name="School">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-5 w-5"
				>
					<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
					<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
				</svg>
			</SideBarItem>
			<SideBarItem path="/personal" name="Personal">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-5 w-5"
				>
					<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
					<circle cx="12" cy="7" r="4"></circle>
				</svg>
			</SideBarItem>
		</SideBar>
		<section class="flex-1 overflow-auto">
			<div class="p-4">
				<h2 class="text-lg font-semibold mb-2">Today's Tasks</h2>
				<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{#each Array(6) as _}
						<TaskCard title="test" description="placeholder" task_id={-1}/>
					{/each}
				</div>
			</div>
			<div class="p-4">
				<h2 class="text-lg font-semibold mb-2">Upcoming Tasks</h2>
				<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{#each Array(6) as _}
<TaskCard title="Worry about this later" description="user defined" task_id={-1}/>
					{/each}
				</div>
			</div>
		</section>
	</section>
	<Footer />
</main>
