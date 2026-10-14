/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type -- remove this line once the TODOs are done */
import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { merge, switchMap } from 'rxjs';
import { MovieSearchResult } from '../../models/movie.model';
import { ShowSearchResult } from '../../models/ts-shows.model';
import { TMDBService } from '../../services/tmdb-service';

// TODO: Define the state interface for media data
export interface MediaState {
  // Include properties for:
  // - the search query
  // - movies and shows: trending while the query is empty, search results otherwise
  // - a loading flag per list
}

// TODO: Define the initial state
const initialState: MediaState = {
  // Initialize your state here
};

// TODO: Create the MediaStore using signalStore
// Remove the prettier-ignore once the TODOs are done
// prettier-ignore
export const MediaStore = signalStore(
  // No providedIn here: the media overview component provides the store (see the README)

  // TODO: Add the initial state using withState

  // TODO: Inject TMDBService with withProps as _tmdb; the underscore keeps it private to the store

  // TODO: Add computed properties using withComputed
  // - isLoading: true while either list loads

  // TODO: Add methods using withMethods
  // Implement `load` as an rxMethod<string> that takes the query:
  // - inside switchMap, store the query and set both loading flags
  // - request trending titles for an empty query, search results otherwise
  // - tapResponse per list: store the results, log errors, clear the loading flag in finalize
);

/**
 * Reference implementation from MediaOverview:
 *
 * protected readonly searchModel = signal({ query: '' });
 * protected readonly searchForm = form(this.searchModel, (path) => {
 *   debounce(path.query, 300);
 * });
 * private readonly query = computed(() => this.searchModel().query);
 * private readonly query$ = toObservable(this.query);
 *
 * protected readonly movies$: Observable<MovieSearchResult[]> = this.query$.pipe(
 *   switchMap((query) => {
 *     if (!query) {
 *       return this.tmdbService.getTrendingMovies();
 *     }
 *     return this.tmdbService.searchMovies(query);
 *   }),
 *   map((response: SearchResponse<MovieSearchResult>) => response.results),
 * );
 *
 * protected readonly shows$: Observable<ShowSearchResult[]> = this.query$.pipe(
 *   switchMap((query) => {
 *     if (!query) {
 *       return this.tmdbService.getTrendingShows();
 *     }
 *     return this.tmdbService.searchShows(query);
 *   }),
 *   map((response: SearchResponse<ShowSearchResult>) => response.results),
 * );
 */
