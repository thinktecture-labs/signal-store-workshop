import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounce, form, FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { map, Observable, switchMap } from 'rxjs';
import { MovieSearchResult } from '../../models/movie.model';
import { SearchResponse } from '../../models/shared.model';
import { ShowSearchResult } from '../../models/ts-shows.model';
import { TMDBService } from '../../services/tmdb-service';
import { MovieCard } from '../movie-card/movie-card';
import { ShowCard } from '../show-card/show-card';

@Component({
  selector: 'app-media-overview',
  imports: [
    AsyncPipe,
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MovieCard,
    ShowCard,
  ],
  templateUrl: './media-overview.html',
  styleUrls: ['./media-overview.scss'],
})
export default class MediaOverview {
  private readonly tmdbService = inject(TMDBService);

  protected readonly searchModel = signal({ query: '' });
  protected readonly searchForm = form(this.searchModel, (path) => {
    // Writes to the model wait until typing pauses; blur and submit flush immediately
    debounce(path.query, 300);
  });
  private readonly query = computed(() => this.searchModel().query);
  private readonly query$ = toObservable(this.query);

  protected readonly movies$: Observable<MovieSearchResult[]> =
    this.query$.pipe(
      switchMap((query) => {
        if (!query) {
          return this.tmdbService.getTrendingMovies();
        }
        return this.tmdbService.searchMovies(query);
      }),
      map((response: SearchResponse<MovieSearchResult>) => response.results),
    );

  protected readonly shows$: Observable<ShowSearchResult[]> = this.query$.pipe(
    switchMap((query) => {
      if (!query) {
        return this.tmdbService.getTrendingShows();
      }
      return this.tmdbService.searchShows(query);
    }),
    map((response: SearchResponse<ShowSearchResult>) => response.results),
  );
}
