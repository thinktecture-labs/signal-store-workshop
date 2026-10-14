import { computed, inject, Signal } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  EmptyFeatureResult,
  patchState,
  signalMethod,
  signalStore,
  SignalStoreFeature,
  signalStoreFeature,
  SignalStoreFeatureResult,
  withComputed,
  withFeature,
  withHooks,
  withMethods,
  withProps,
  withState,
  WritableStateSource,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { withDevtools } from '@ngrx-toolkit/core';
import { Observable, switchMap } from 'rxjs';
import { SearchResponse } from '../../models/shared.model';
import { TMDBService } from '../../services/tmdb-service';

// The state one list adds, with keys derived from its name: movies and moviesLoading
export type MediaListState<Name extends string, Item> = Record<Name, Item[]> &
  Record<`${Name}Loading`, boolean>;

type MediaListLoader<Item> = (
  query: string,
) => Observable<SearchResponse<Item>>;

/**
 * A custom feature, reusable store logic built with signalStoreFeature.
 * One list that follows the store's query: `name` holds the results and
 * `${name}Loading` the loading flag. The feature knows nothing about TMDB:
 * the store passes a loader that fetches the list for a query.
 *
 * Typed like withEntities: this signature gives the store the exact members,
 * the implementation below works with plain string keys.
 */
export function withMediaList<Name extends string, Item>(
  name: Name,
  loader: MediaListLoader<Item>,
): SignalStoreFeature<
  EmptyFeatureResult & { state: { query: string } },
  EmptyFeatureResult & { state: MediaListState<Name, Item> }
>;
export function withMediaList(
  name: string,
  loader: MediaListLoader<unknown>,
): SignalStoreFeature<
  EmptyFeatureResult & { state: { query: string } },
  SignalStoreFeatureResult
> {
  const loadingKey = `${name}Loading`;

  return signalStoreFeature(
    withState<Record<string, unknown>>({ [name]: [], [loadingKey]: false }),
    withHooks(
      (
        store: Record<string, Signal<unknown>> & WritableStateSource<object>,
      ) => ({
        // Runs once with the current query and again on every change
        onInit: () =>
          rxMethod<string>(
            switchMap((query) => {
              // Set the flag here, not in a tap before the switchMap: switchMap first
              // cancels the previous request, whose finalize clears the flag
              patchState(store, { [loadingKey]: true });
              return loader(query).pipe(
                tapResponse({
                  next: ({ results }) => patchState(store, { [name]: results }),
                  error: (error) =>
                    console.error(`Error loading ${name}:`, error),
                  finalize: () => patchState(store, { [loadingKey]: false }),
                }),
              );
            }),
          )(store['query'] as Signal<string>),
      }),
    ),
  );
}

// Create the MediaStore using signalStore
export const MediaStore = signalStore(
  // Provided by the feature component that owns the media overview (see media-overview.ts)
  // Connect the store to the Redux DevTools extension (demo)
  withDevtools('media'),

  // The query both lists follow
  withState({ query: '' }),

  // Inject dependencies once with withProps: the underscore keeps _tmdb private to the store
  withProps(() => ({ _tmdb: inject(TMDBService) })),

  // One custom feature per list: trending while the query is empty, search results otherwise.
  // Each adds a list and its loading flag, named after the first argument. withFeature hands
  // the store's members to the feature, so the loaders can use _tmdb
  withFeature(({ _tmdb }) =>
    withMediaList('movies', (query) =>
      query ? _tmdb.searchMovies(query) : _tmdb.getTrendingMovies(),
    ),
  ),

  withFeature(({ _tmdb }) =>
    withMediaList('shows', (query) =>
      query ? _tmdb.searchShows(query) : _tmdb.getTrendingShows(),
    ),
  ),

  // Add computed properties using withComputed
  withComputed(({ moviesLoading, showsLoading }) => ({
    isLoading: computed(() => moviesLoading() || showsLoading()),
  })),

  // Add methods using withMethods
  withMethods((store) => ({
    // Follows a signal: the component passes its debounced query
    setQuery: signalMethod<string>((query) => patchState(store, { query })),
  })),
);
