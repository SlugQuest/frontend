<script script="ts">
    import { BACKEND_URL } from './BackendURL';
    import { onMount } from 'svelte';
  
    let friends = [];
    let leaderboard = [];
    let teams = [];
  
    onMount(async () => {
      // Fetch friends, leaderboard, and teams data from your API or data source here
      // These are just placeholders
      friends = [
        'Friend 1', 'Friend 2', 'Friend 3'
    ];
      leaderboard = [
        { name: 'Friend 1', score: 100 },
        { name: 'Friend 2', score: 90 },
        { name: 'Friend 3', score: 80 },
      ];
      teams = [
        { name: 'Team 1', members: ['Member 1', 'Member 2'] },
        { name: 'Team 2', members: ['Member 3', 'Member 4'] },
      ];
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
          {#each friends as friend (friend)}
            <li>{friend}</li>
          {/each}
        </ul>
        {#if friends.length === 0}
          <p>Looks like you have no friends. How sad!</p>
        {/if}
        <div>
            <button class="btn mt-2">Add Friend</button>
        </div>
      </div>
  
      <div>
        <h2 class="section-header text-2xl">Teams</h2>
        {#each teams as team (team.name)}
          <div>
            <h3 class="team-name">{team.name}</h3>
            <ul>
              {#each team.members as member (member)}
                <li class="member-name">{member}</li>
              {/each}
            </ul>
          </div>
        {/each}
        <button class="btn mt-2" on:click={createTeam}>Create Team</button> 
      </div>
  
      <div>
        <h2 class="section-header text-2xl">Leaderboard</h2>
        <table class="leaderboard">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {#each leaderboard as entry (entry.name)}
              <tr>
                <td>{entry.name}</td>
                <td>{entry.score}</td>
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

  </style>