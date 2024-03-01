<script lang="ts">
    import { BACKEND_URL } from './BackendURL';

    let teamName = '';

    let teams = [];

    async function createTeam() {
        if (teamName === '') {
            alert('Please enter a team name');
            return;
        }
        try {
            const response = await fetch(`${BACKEND_URL}/createTeam/${teamName}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
</script>

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