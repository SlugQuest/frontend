import { writable } from 'svelte/store';

function createCategoryStore() {
  const { subscribe, set } = writable<string | undefined>(undefined);

  return {
    subscribe,
    setCategory: (category: string) => set(category),
    clearCategory: () => set(undefined),
  };
}

export const categoryStore = createCategoryStore();
