import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WatchlistStore } from '../../stores/watchlist-store';

@Component({
  selector: 'app-watchlist-button',
  imports: [MatIconModule, MatButtonModule],
  template: `
    <button mat-icon-button (click)="toggleWatchlist()">
      <mat-icon>
        {{ isInWatchlist() ? 'favorite' : 'favorite_border' }}
      </mat-icon>
    </button>
  `,
  styles: [
    `
      .mat-icon {
        color: #ff4081;
      }
    `,
  ],
})
export class WatchlistButton {
  private readonly store = inject(WatchlistStore);
  private readonly snackBar = inject(MatSnackBar);

  readonly itemId = input.required<number>();
  readonly itemType = input.required<'movie' | 'tv'>();
  readonly title = input.required<string>();
  readonly posterPath = input.required<string>();

  readonly isInWatchlist = computed(() =>
    this.store.isInWatchlist(this.itemId(), this.itemType()),
  );

  toggleWatchlist(): void {
    if (this.isInWatchlist()) {
      const item = this.store.removeFromWatchlist(
        this.itemId(),
        this.itemType(),
      );
      if (item) {
        this.snackBar.open(`Removed ${item.title} from watchlist`, 'Close');
      }
      return;
    }

    const item = this.store.addToWatchlist({
      id: this.itemId(),
      type: this.itemType(),
      title: this.title(),
      posterPath: this.posterPath(),
    });
    if (item) {
      this.snackBar.open(`Added ${item.title} to watchlist`, 'Close');
    }
  }
}
