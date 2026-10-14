/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type -- remove this line once the TODOs are done */
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { WatchlistItem } from '../models/watchlist.model';

// TODO: Define the state interface for the watchlist
export interface WatchlistState {
  // Define the shape of your state here
  // Hint: It should include an array of WatchlistItem
}

// TODO: Define the initial state
const initialState: WatchlistState = {
  // Initialize your state here
};

// TODO: Create the WatchlistStore using signalStore
// Remove the prettier-ignore once the TODOs are done
// prettier-ignore
export const WatchlistStore = signalStore(
  // TODO: Make the store injectable at the root level

  // TODO: Add the initial state using withState

  // TODO: Add computed properties using withComputed
  // Hint: Convert the existing computed properties from WatchlistService

  // TODO: Add methods using withMethods
  // Hint: Convert the existing methods from WatchlistService. Return the item each method
  // changed instead of showing a snackbar; the messages move into the components.
);

/**
 * Reference implementation of the existing WatchlistService:
 *
 * @Injectable({
 *   providedIn: 'root',
 * })
 * export class WatchlistService {
 *   private readonly watchlistSignal = signal<WatchlistItem[]>([]);
 *   private readonly snackBar = inject(MatSnackBar);
 *
 *   readonly watchlist = this.watchlistSignal.asReadonly();
 *
 *   readonly watchedItems = computed(() =>
 *     this.watchlistSignal().filter((item) => item.isWatched),
 *   );
 *
 *   readonly unwatchedItems = computed(() =>
 *     this.watchlistSignal().filter((item) => !item.isWatched),
 *   );
 *
 *   addToWatchlist(item: Omit<WatchlistItem, 'isWatched' | 'addedAt'>) {
 *     const newItem: WatchlistItem = {
 *       ...item,
 *       isWatched: false,
 *       addedAt: new Date(),
 *     };
 *
 *     this.watchlistSignal.update((items) => {
 *       if (items.some((i) => i.id === item.id && i.type === item.type)) {
 *         return items;
 *       }
 *
 *       this.snackBar.open(`Added ${item.title} to watchlist`, 'Close');
 *       return [...items, newItem];
 *     });
 *   }
 *
 *   removeFromWatchlist(id: number, type: 'movie' | 'tv') {
 *     const item = this.watchlistSignal().find(
 *       (i) => i.id === id && i.type === type,
 *     );
 *     if (item) {
 *       this.watchlistSignal.update((items) => {
 *         const filtered = items.filter((i) => !(i.id === id && i.type === type));
 *         this.snackBar.open(`Removed ${item.title} from watchlist`, 'Close');
 *         return filtered;
 *       });
 *     }
 *   }
 *
 *   toggleWatchedStatus(id: number, type: 'movie' | 'tv') {
 *     this.watchlistSignal.update((items) =>
 *       items.map((item) => {
 *         if (item.id === id && item.type === type) {
 *           const newStatus = !item.isWatched;
 *           this.snackBar.open(
 *             `Marked ${item.title} as ${newStatus ? 'watched' : 'unwatched'}`,
 *             'Close',
 *           );
 *           return { ...item, isWatched: newStatus };
 *         }
 *         return item;
 *       }),
 *     );
 *   }
 *
 *   isInWatchlist(id: number, type: 'movie' | 'tv'): boolean {
 *     return this.watchlistSignal().some(
 *       (item) => item.id === id && item.type === type,
 *     );
 *   }
 *
 *   getWatchedStatus(id: number, type: 'movie' | 'tv'): boolean {
 *     const item = this.watchlistSignal().find(
 *       (item) => item.id === id && item.type === type,
 *     );
 *     return item?.isWatched ?? false;
 *   }
 * }
 */
