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

type Filter = 'recurring' | 'team' | 'non-recurring' | 'personal';

function createFilterStore() {
  const { subscribe, set } = writable<'recurring' | 'team' | undefined>(undefined);

  return {
    subscribe,
    setFilter: (filter: 'recurring' | 'team') => set(filter),
    clearFilter: () => set(undefined),
  };
}

export const filterStore = createFilterStore();
