import { BACKEND_URL } from './BackendURL';
import { writable } from 'svelte/store';

async function fetchFriends() {
const response = await fetch(`${BACKEND_URL}/api/v1/user/friends`, {
    credentials: 'include'
});
if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

function createFriendStore() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        prepareFriends: async function() {
        const fetchedFriends = await fetchFriends();
        set(fetchedFriends.list); // set the list property of fetchedFriends to the friendStore
        }
    };
}

export const friendStore = createFriendStore();

