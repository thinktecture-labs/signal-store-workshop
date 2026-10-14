import { DecimalPipe, SlicePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MovieSearchResult } from '../../models/movie.model';
import { TmdbImagePipe } from '../../pipes/tmdb-image-pipe';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { WatchlistButton } from '../watchlist-button/watchlist-button';

@Component({
  selector: 'app-movie-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    TmdbImagePipe,
    SlicePipe,
    DecimalPipe,
    RouterLink,
    WatchlistButton,
  ],
  template: ` @let movie = this.movie();

    <mat-card class="media-card">
      <img
        mat-card-image
        [src]="movie.poster_path | tmdbImage"
        [alt]="movie.title"
      />
      <mat-card-content>
        <h3>{{ movie.title }}</h3>
        <p>{{ movie.overview | slice: 0 : 150 }}...</p>
        <div class="rating">
          Rating: {{ movie.vote_average | number: '1.1-1' }}/10
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button color="primary" [routerLink]="['/movie', movie.id]">
          View Details
        </button>
        <app-watchlist-button
          [itemId]="movie.id"
          itemType="movie"
          [title]="movie.title"
          [posterPath]="movie.poster_path || ''"
        >
        </app-watchlist-button>
      </mat-card-actions>
    </mat-card>`,
  styles: [
    `
      mat-card-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
      }
    `,
  ],
})
export class MovieCard {
  readonly movie = input.required<MovieSearchResult>();
}
