import { BACKEND_URL } from './BackendURL';
import { writable } from 'svelte/store';

export type Member = {
	BossID: number;
	Picture: string;
	Points: number;
	SocialCode: string;
	Username: string;
};

export type Team = {
	Members: Member[];
	Name: string;
	TeamID: number;
};

async function fetchTeams() {
	const response = await fetch(`${BACKEND_URL}/api/v1/getUserTeams`, {
		credentials: 'include'
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();

	return data;
}

function createTeamStore() {
	const { subscribe, set, update } = writable<Team[]>([]);

	return {
		subscribe,
		prepareTeams: async function () {
			const fetchedTeams = await fetchTeams();
			set(fetchedTeams.teams); // set the list property of fetchedTeams to the teamStore
		}
	};
}

export const teamStore = createTeamStore();
