// store.ts
import { writable } from 'svelte/store';

export const curr_health = writable<number>(100);
export const user_points = writable<number>(0);
export const boss_name = writable<string>('');
export const boss_image = writable<string>('');