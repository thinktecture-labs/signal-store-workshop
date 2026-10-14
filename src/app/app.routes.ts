import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/media-overview/media-overview'),
  },
  {
    path: 'movie/:movieId',
    loadComponent: () => import('./components/movie-details/movie-details'),
  },
  {
    path: 'show/:showId',
    loadComponent: () => import('./components/show-details/show-details'),
  },
  {
    path: 'watchlist',
    loadComponent: () => import('./components/watchlist/watchlist'),
  },
  {
    path: 'todos',
    loadComponent: () => import('./components/todo-list/todo-list'),
  },
  // Lab solutions wired to the Redux DevTools, not linked in the navigation
  {
    path: 'demo/media',
    loadComponent: () =>
      import(
        '../../exercises/03-media-store/solution/media-overview-with-store'
      ),
  },
  {
    path: 'demo/todo',
    loadComponent: () =>
      import('../../exercises/01-todo-store/solution/todo-list-with-store'),
  },
];
