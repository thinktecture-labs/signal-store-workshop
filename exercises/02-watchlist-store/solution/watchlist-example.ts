import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WatchlistStore } from './watchlist-store';
import { WatchlistItem } from '../../../src/app/models/watchlist.model';

/**
 * Example component showing how to use the WatchlistStore
 */
@Component({
  selector: 'app-watchlist-example',
  imports: [MatButtonModule],
  templateUrl: './watchlist-example.html',
})
export class WatchlistExample {
  readonly store = inject(WatchlistStore);
  private readonly snackBar = inject(MatSnackBar);

  toggleWatched(id: number, type: 'movie' | 'tv'): void {
    const item = this.store.toggleWatchedStatus(id, type);
    if (item) {
      this.snackBar.open(
        `Marked ${item.title} as ${item.isWatched ? 'watched' : 'unwatched'}`,
        'Close',
      );
    }
  }

  remove(id: number, type: 'movie' | 'tv'): void {
    const item = this.store.removeFromWatchlist(id, type);
    if (item) {
      this.snackBar.open(`Removed ${item.title} from watchlist`, 'Close');
    }
  }

  addMockMovie(): void {
    // Add a sample movie to the watchlist
    const mockItem: Omit<WatchlistItem, 'isWatched' | 'addedAt'> = {
      id: Math.floor(Math.random() * 1000),
      title: `Sample Movie ${Math.floor(Math.random() * 100)}`,
      type: 'movie',
      posterPath: '/sample-poster.jpg',
    };

    const item = this.store.addToWatchlist(mockItem);
    if (item) {
      this.snackBar.open(`Added ${item.title} to watchlist`, 'Close');
    }
  }
}
