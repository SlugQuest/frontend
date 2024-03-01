<script script="ts">
    import { BACKEND_URL } from './BackendURL';
    import { onMount } from 'svelte';
    import SearchBar from './SearchBar.svelte';
	import Teams from './Teams.svelte';
  
    let friends = [];
    
    async function getFriends() {
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/user/friends`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            friends = data.list;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function removeFriend(name, code) {
        if (confirm(`Are you sure you want to remove ${name} as a friend?`)) {
            try {
                const response = await fetch(`${BACKEND_URL}/api/v1/removeFriend/${code}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
  
    onMount(async () => {
        await getFriends();
    });
  
    function goBack() {
      // Implement navigation back to the main task view
      window.location.href = '/loggedin';
    }
  
    async function logOut() {
      // Implement logout functionality
      window.location.href = `${BACKEND_URL}/logout`;
    }
  
    function createTeam() {
      // Implement team creation functionality
    }
  </script>
  
  <div class="flex justify-end">
    <button class="btn m-2" on:click={goBack}>Go Back</button>
    <button class="btn m-2" on:click={logOut}>Log Out</button>
  </div>
  
  <div class="flex justify-center">
    <div class="flex justify-between w-3/4">
      <div>
        <h2 class="section-header text-2xl">Friends</h2>
        <ul>
            {#each friends as friend (friend.Username, friend.SocialCode)}
                <li>
                    <span>{friend}</span>
                    <button class="remove-button" on:click={() => removeFriend(friend)}>x</button>
                </li>
            {/each}
        </ul>
        {#if friends.length === 0}
          <p>No friends to display</p>
        {/if}
        <div>
            <SearchBar />
        </div>
      </div>

      <Teams />
  
      <div>
        <h2 class="text-2xl">Leaderboard</h2>
        <table class="leaderboard">
          <thead>
            <tr>
              <th>Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {#each [...friends].sort((a, b) => b.Points - a.Points) as friend (friend.Username)}
              <tr>
                <td>{friend.Username}</td>
                <td>{friend.Points}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>

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
  
    .btn:active {
      background-color: #004085;
    }

    .team-name {
    font-weight: bold;
    font-size: 18px;
    }

    .member-name {
    font-size: 16px;
    }

    .leaderboard th {
    padding: 0 20px;
    }

    .leaderboard th,
    .leaderboard td {
    text-align: center;
    } 
    .section-header {
    font-size: 24px;
    font-weight: bolder;
  }
  .remove-button {
    color: red;
    border: none;
    background: none;
    cursor: pointer;
  }

  </style>