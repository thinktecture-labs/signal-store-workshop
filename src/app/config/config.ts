import {
  provideAppInitializer,
  inject,
  makeEnvironmentProviders,
  signal,
  computed,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Config } from '../models/config.model';
import { TMDBService } from '../services/tmdb-service';

export const tmdbConfig = signal<Config | null>(null);
export const tmdbImageUrl = computed(() => {
  const config = tmdbConfig();
  return config ? `${config.images.base_url}/w500/` : '';
});

export const provideTMDBConfig = () =>
  makeEnvironmentProviders([
    provideAppInitializer(async () => {
      const tmdbService = inject(TMDBService);
      try {
        tmdbConfig.set(await firstValueFrom(tmdbService.getConfig()));
      } catch (error) {
        // Without the TMDB config the movie pages stay empty, the rest of the app still works
        console.warn('Could not load the TMDB configuration', error);
      }
    }),
  ]);
