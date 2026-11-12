import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { TmdbImagePipe } from '../../pipes/tmdb-image-pipe';
import { TMDBService } from '../../services/tmdb-service';
import { WatchlistButton } from '../watchlist-button/watchlist-button';

@Component({
  selector: 'app-movie-details',
  imports: [
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    RouterLink,
    TmdbImagePipe,
    WatchlistButton,
  ],
  templateUrl: './movie-details.html',
  styleUrls: ['./movie-details.scss'],
})
export default class MovieDetails {
  private readonly tmdbService = inject(TMDBService);
  private readonly route = inject(ActivatedRoute);

  readonly movieDetails = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) =>
        this.tmdbService.getMovieDetails(params.get('movieId') ?? ''),
      ),
    ),
  );
}
