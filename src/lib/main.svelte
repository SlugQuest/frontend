<script>
import Footer from "./Footer.svelte";
import SideBar from "./SideBar.svelte";
import TaskCard from "./TaskCard.svelte";
import TopBar from "./TopBar.svelte";

</script>
<main class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
  <TopBar />
  <section class="flex flex-1 overflow-hidden">
    <SideBar />
    <section class="flex-1 overflow-auto">
      <div class="p-4">
        <h2 class="text-lg font-semibold mb-2">Today's Tasks</h2>
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {#each Array(6) as _}
            <TaskCard />
          {/each}
        </div>
      </div>
      <div class="p-4">
        <h2 class="text-lg font-semibold mb-2">Upcoming Tasks</h2>
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {#each Array(6) as _}
            <TaskCard />
          {/each}
        </div>
      </div>
    </section>
  </section>
  <Footer />
</main>
