import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { TmdbImagePipe } from '../../pipes/tmdb-image-pipe';
import { WatchlistStore } from '../../stores/watchlist-store';

@Component({
  selector: 'app-watchlist',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    TmdbImagePipe,
  ],
  templateUrl: './watchlist.html',
  styleUrls: ['./watchlist.scss'],
})
export default class Watchlist {
  private readonly store = inject(WatchlistStore);
  private readonly snackBar = inject(MatSnackBar);

  readonly watchlist = this.store.watchlist;

  toggleWatched(id: number, type: 'movie' | 'tv'): void {
    const item = this.store.toggleWatchedStatus(id, type);
    if (item) {
      this.snackBar.open(
        `Marked ${item.title} as ${item.isWatched ? 'watched' : 'unwatched'}`,
        'Close',
      );
    }
  }

  removeFromWatchlist(id: number, type: 'movie' | 'tv'): void {
    const item = this.store.removeFromWatchlist(id, type);
    if (item) {
      this.snackBar.open(`Removed ${item.title} from watchlist`, 'Close');
    }
  }
}
