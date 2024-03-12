<script>
	import { BACKEND_URL } from './BackendURL';
    import { friendStore } from './friendStore';

	let showModal = false;
	let newModal = false;
	let searchQuery = '';
	let search_results = [];

	function open() {
		showModal = true;
		newModal = false;
		search_results = [];
		searchQuery = '';
	}

	function openNew() {
		newModal = true;
		showModal = false;
	}

	function close() {
		showModal = false;
		console.log(searchQuery);
	}

	function closeNew() {
		newModal = false;
		search_results = [];
		searchQuery = '';
	}

	async function search(num) {
		console.log(searchQuery);
		let path = '/api/v1/searchuser/';
		if (num == 0) {
			path += 'name/';
		} else if (num == 1) {
			path += 'code/';
		} else {
		}
		const search_response = await fetch(`${BACKEND_URL}${path}` + searchQuery, {
			method: 'GET',
			credentials: 'include'
		});

		if (search_response.ok) {
			const search_data = await search_response.json();
			console.log(search_data);
			let num_results = search_data.num_results;
			for (let i = 0; i < num_results; i++) {
				let pair = [search_data.users[i].Username, search_data.users[i].SoicalCode];
				console.log(pair);
				search_results.push(pair);
			}
			console.log(search_results);
			if (num_results > 0) {
				console.log('Success');
				close();
				openNew();
			} else {
				console.log('No results');
			}
		} else {
			console.log('Error');
		}
	}

	async function addFriend(friend) {
		console.log('ITS WORKINGNNNNN ' + friend);
		const add_response = await fetch(`${BACKEND_URL}/api/v1/addFriend/` + friend[1], {
			method: 'POST',
			credentials: 'include'
		});

		if (add_response.ok) {
			console.log('Success');
			closeNew();
		} else {
			console.log('Error');
		}
        friendStore.prepareFriends();
	}
</script>

<button
	on:click={open}
	class="btn mt-2"
>
	Add Friend
</button>

{#if showModal}
	<div
		class="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
			aria-hidden="true"
		></div>
		<div
			class="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all px-4 py-3 sm:max-w-md sm:w-full"
		>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search..."
				class="w-full px-3 py-2 border border-gray-300 rounded-md"
			/>
			<div class="flex justify-end mt-3">
				<button
					type="button"
					on:click={close}
					class="mr-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
				>
					Cancel
				</button>
				<button
					type="button"
					on:click={() => search(0)}
					class="mr-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
				>
					Search by name
				</button>
				<button
					type="button"
					on:click={() => search(1)}
					class="mr-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
				>
					Search by code
				</button>
			</div>
		</div>
	</div>
{/if}

{#if newModal}
	<div
		class="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
			aria-hidden="true"
		></div>
		<div
			class="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all px-4 py-3 sm:max-w-md sm:w-full"
		>
			{#each search_results as result (result)}
				<div class="mt-2 flex justify-between items-center border border-gray-300 p-2 rounded">
					<div>{result[0]}#{result[1]}</div>
					<button
						type="button"
						on:click={() => addFriend(result)}
						class="mr-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
					>
						Add
					</button>
				</div>
			{/each}
			<div class="flex justify-end mt-3">
				<button
					type="button"
					on:click={closeNew}
					class="mr-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
    .btn {
      padding: 5px 10px;
      background-color: #007BFF;
      color: white;
      border: none;
      border-radius: 2px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
  
    .btn:hover {
      background-color: #0056b3;
    }
</style>