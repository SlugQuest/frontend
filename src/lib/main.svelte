<script>
	import Footer from './Footer.svelte';
	import SideBar from './SideBar.svelte';
	import SideBarItem from './SideBarItem.svelte';
	import TaskCardView from './TaskCardView.svelte';
	import { taskStore } from './taskStore';
	import TopBar from './TopBar.svelte';
  import { categoryStore, filterStore } from './categoryStore';

	/**
	 * @typedef {{label: string, callback: () => void}} CatagoryAndCallBack
	 * @type {CatagoryAndCallBack[]} */
	let catagories = [];
	taskStore.subscribe(
		(value) =>
			(catagories = Array.from(
				new Set(
					value
						.map((task) => {
							return {
								label: task.Category,
								callback: () => {
									if ($categoryStore === task.Category) {
										categoryStore.clearCategory();
									} else {
                    filterStore.clearFilter();
										categoryStore.setCategory(task.Category);
									}
								}
							};
						})
						.filter((cat) => cat.label !== '')
				)
			))
	);
</script>

<main class="flex flex-col h-screen bg-white">
	<TopBar title="SlugQuest" />
	<section class="flex flex-1 overflow-hidden">
		<SideBar title="Categories">
			{#each catagories as catagory}
				<SideBarItem {...catagory} />
			{/each}
			<SideBarItem
				label="Recurring"
				callback={() => {
          if ($filterStore === 'recurring') {
            filterStore.clearFilter();
          } else {
            console.log('recurring');
            filterStore.setFilter('recurring');
            categoryStore.clearCategory();
          }
				}}
			/>
      <SideBarItem
        label="Non-Recurring"
        callback={() => {
          if ($filterStore === 'non-recurring') {
            filterStore.clearFilter();
          } else {
            console.log('non-recurring');
            filterStore.setFilter('non-recurring');
            categoryStore.clearCategory();
          }
        }}
      />
      <SideBarItem
        label="Team"
        callback={() => {
          if ($filterStore === 'team') {
            filterStore.clearFilter();
          } else {
            console.log('team');
            categoryStore.clearCategory();
            filterStore.setFilter('team');
          }
        }}
      />
      <SideBarItem
        label="Personal"
        callback={() => {
          if ($filterStore === 'personal') {
            filterStore.clearFilter();
          } else {
            categoryStore.clearCategory();
            filterStore.setFilter('personal');
          }
        }}
      />
      <SideBarItem
        label="Complete"
        callback={() => {
          if ($filterStore === 'complete') {
            filterStore.clearFilter();
          } else {
            categoryStore.clearCategory();
            filterStore.setFilter('complete');
          }
        }}
      />
		</SideBar>
		<TaskCardView />
	</section>
	<Footer />
</main>
