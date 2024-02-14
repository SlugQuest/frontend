<script>
	import Footer from './Footer.svelte';
	import SideBar from './SideBar.svelte';
	import SideBarItem from './SideBarItem.svelte';
	import TaskCardView from './TaskCardView.svelte';
	import { taskStore } from './taskStore';
	import TopBar from './TopBar.svelte';

  /** @type {string[]} */
  let catagories = [];
  taskStore.subscribe(value => 
    catagories = Array.from(new Set(value.map(task => task.Category)))
  );
</script>

<main class="flex flex-col h-screen bg-white">
	<TopBar title="SlugQuest"/>
	<section class="flex flex-1 overflow-hidden">
		<SideBar title="Categories">
      {#each catagories as catagory}
        <SideBarItem catagory={catagory} />
      {/each}
		</SideBar>
		<TaskCardView />
	</section>
	<Footer />
</main>
