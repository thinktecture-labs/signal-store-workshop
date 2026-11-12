import { Component, computed, inject, signal } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MovieCard } from '../movie-card/movie-card';
import { ShowCard } from '../show-card/show-card';
import { MediaStore } from './media-store';

/**
 * MediaOverview refactored to use the MediaStore.
 * Same template and styles as src/app/components/media-overview, the RxJS
 * pipelines in the component are replaced by the store's signals and methods.
 */
@Component({
  selector: 'app-media-overview',
  imports: [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MovieCard,
    ShowCard,
  ],
  providers: [MediaStore], // Provide the store at component level
  templateUrl: './media-overview.html',
  styleUrl: './media-overview.scss',
})
export default class MediaOverview {
  protected readonly store = inject(MediaStore);

  protected readonly searchModel = signal({ query: '' });
  protected readonly searchForm = form(this.searchModel, (path) => {
    // Writes to the model wait until typing pauses; blur and submit flush immediately
    debounce(path.query, 300);
  });
  private readonly query = computed(() => this.searchModel().query);

  constructor() {
    // signalMethod follows the signal: the store's query starts empty, which loads the
    // trending lists, and changes with every settled search query
    this.store.setQuery(this.query);
  }
}
