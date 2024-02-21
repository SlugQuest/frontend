// store.ts
import { writable } from 'svelte/store';

export const curr_health = writable<number>(100);
export const user_points = writable<number>(0);