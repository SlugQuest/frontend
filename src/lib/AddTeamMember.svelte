<script lang="ts">
    import { onMount } from 'svelte';
    import { BACKEND_URL } from './BackendURL';
    import { friendStore } from './friendStore';

    export let tid: Number;

    let selectedFriend = null;
    let showModal = false;
  
    async function addFriendToTeam() {
      // Add the selected friend to the team
      // Close the modal
        await fetch(`${BACKEND_URL}/api/v1/addUserTeam/${tid}/${selectedFriend}`, {
            method: 'PUT',
            credentials: 'include',
        });
        showModal = false;
    }
  </script>
  
  <button on:click={() => showModal = true}>Add Friend to Team</button>

{#if showModal}
  <div class="backdrop"></div>
  <div class="modal">
    <h2>Select a Friend</h2>
    <select bind:value={selectedFriend}>
      <option disabled selected value> -- select a friend -- </option>
      {#each $friendStore as friend (friend.Username)}
        <option value={friend.SocialCode}>{friend.Username}</option>
      {/each}
    </select>
    <div class="button-container">
      <button on:click={addFriendToTeam}>Add to Team</button>
      <button on:click={() => showModal = false}>Close</button>
    </div>
  </div>
{/if}

<style>
    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }
  
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      border: 1px solid #fff;
      background-color: #fff;
    }
    .button-container {
    margin-top: 10px;
  }
  .button-container button {
    border: 1px solid #000; /* Add a black border around the buttons */
    margin-right: 10px; /* Add a 10px space to the right of the buttons */
    padding: 5px; /* Add a 5px padding inside the buttons */
  }
  </style>