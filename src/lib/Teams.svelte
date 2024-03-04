<script lang="ts">
	import { get } from 'svelte/store';
    import { BACKEND_URL } from './BackendURL';

    let newTeamName = '';

    let teams = [
        // { name: 'Team 1', members: ['Alice', 'Bob'] },
        // { name: 'Team 2', members: ['Charlie', 'Dave'] },
    ];

    let showTeamCreationModal = false;
    let newMemberName = '';

    function teamCreationModal() {
        showTeamCreationModal = true;
    }

    function closeTeamCreationModal() {
        newTeamName = '';
        showTeamCreationModal = false;
    }

    async function createTeam() {
        if (newTeamName === '') {
            alert('Please enter a team name');
            return;
        }
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/createTeam/${newTeamName}`, {
                method: 'PUT',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        getUserTeams();
        closeTeamCreationModal();
    }

    async function deleteTeam(teamID) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/deleteTeam/${teamID}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        getUserTeams();
    }

    async function deleteTeamUser(teamID, socialCode) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/deleteTeamUser/${teamID}/${socialCode}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        getUserTeams();
    }

    async function getUserTeams() {
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/getUserTeams`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            teams = data.teams;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
</script>

<div>
    <h2 class="section-header text-2xl">Teams</h2>
    {#each teams as team (team.name)}
      <div>
        <h3 class="team-name">
            <span>{team.name}</span> 
            <button class="remove-button" on:click={() => deleteTeam(team)}>x</button>
        </h3>
        <ul>
          {#each team.members as member (member)}
            <li>
                <span class="member-name">{member}</span> 
                <button class="remove-button" on:click={() => deleteMember(team, member)}>x</button>
            </li>
          {/each}
          <li><span class="member-name"></span><button on:click={() => openAddMemberModal(team)}>+</button></li>
        </ul>
      </div>
    {/each}
    <button class="btn mt-2" on:click={teamCreationModal}>Create Team</button> 
</div>

{#if showTeamCreationModal}
    <div class="modal">
        <div class="modal-content">
            <h2>Create a new team</h2>
            <input type="text" bind:value={newTeamName} placeholder="Team name" />

            <div class="button-container">
                <button class="mr-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                on:click={createTeam}>Create Team</button>
                <button class="mr-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                on:click={closeTeamCreationModal}>Cancel</button>
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

    .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .member-name {
    margin-left: 20px;
  }

  .modal-content {
    background: white;
    padding: 1em;
    border-radius: 8px;
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .modal-content h2 {
    font-size: 2.5em;
  }

  .modal-content input {
    outline: 2px solid #000;
    padding: 5px;
    margin: 5px;
  }
  .button-container {
    display: flex;
    width: 100%;
  }

  .remove-button {
    color: red;
    border: none;
    background: none;
    cursor: pointer;
  }
</style>