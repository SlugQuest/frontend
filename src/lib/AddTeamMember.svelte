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
    <button on:click={addFriendToTeam}>Add to Team</button>
    <button on:click={() => showModal = false}>Close</button>
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
      /* Other styles for your modal */
    }
  </style>