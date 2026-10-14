import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import {
  addEntity,
  entityConfig,
  removeEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { WatchlistItem } from '../../../src/app/models/watchlist.model';

type MediaType = WatchlistItem['type'];

// A movie and a TV show can share a TMDB id, so the entity id combines type and id
const watchlistId = (id: number, type: MediaType) => `${type}-${id}`;

const watchlistEntity = entityConfig({
  entity: type<WatchlistItem>(),
  selectId: (item) => watchlistId(item.id, item.type),
});

// Create the WatchlistStore using signalStore.
// User feedback stays in the components: the methods return what they changed.
export const WatchlistStore = signalStore(
  // Root singleton: the watchlist button on every card and the watchlist page share it
  { providedIn: 'root' },

  // withEntities replaces the array: it adds entityMap, ids and entities
  withEntities(watchlistEntity),

  // Add computed properties using withComputed
  withComputed(({ entities }) => ({
    // Same public API as the WatchlistService
    watchlist: entities,
    watchedItems: computed(() => entities().filter((item) => item.isWatched)),
    unwatchedItems: computed(() =>
      entities().filter((item) => !item.isWatched),
    ),
  })),

  // Add methods using withMethods
  withMethods((store) => ({
    addToWatchlist(
      item: Omit<WatchlistItem, 'isWatched' | 'addedAt'>,
    ): WatchlistItem | undefined {
      if (store.entityMap()[watchlistId(item.id, item.type)]) {
        return undefined;
      }

      const newItem: WatchlistItem = {
        ...item,
        isWatched: false,
        addedAt: new Date(),
      };

      patchState(store, addEntity(newItem, watchlistEntity));

      return newItem;
    },

    removeFromWatchlist(
      id: number,
      type: MediaType,
    ): WatchlistItem | undefined {
      const item = store.entityMap()[watchlistId(id, type)];
      if (!item) {
        return undefined;
      }

      patchState(store, removeEntity(watchlistId(id, type)));

      return item;
    },

    toggleWatchedStatus(
      id: number,
      type: MediaType,
    ): WatchlistItem | undefined {
      const key = watchlistId(id, type);
      if (!store.entityMap()[key]) {
        return undefined;
      }

      patchState(
        store,
        updateEntity(
          { id: key, changes: (item) => ({ isWatched: !item.isWatched }) },
          watchlistEntity,
        ),
      );

      return store.entityMap()[key];
    },

    // Lookups by id read the entity map instead of scanning the list
    isInWatchlist(id: number, type: MediaType): boolean {
      return watchlistId(id, type) in store.entityMap();
    },

    getWatchedStatus(id: number, type: MediaType): boolean {
      return store.entityMap()[watchlistId(id, type)]?.isWatched ?? false;
    },
  })),
);
