# NgRx Signal Store Cheat Sheet

Quick reference for the workshop, in the order of the slides. Angular 22, `@ngrx/signals` 22.

## Installation

```bash
npm install @ngrx/signals          # Signal Store
npm install @ngrx/operators        # tapResponse, mapResponse
npm install -D @ngrx/eslint-plugin # optional lint rules
```

## Store Structure

A store is composed from features. Order matters: each feature sees what the features above it provide.

```ts
export const TodoStore = signalStore(
  { providedIn: 'root' }, // omit to provide the store per component
  withState(initialState),
  withComputed(() => ({})),
  withMethods(() => ({})),
  withProps(() => ({})),
  withHooks(() => ({})),
);
```

## State

```ts
interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

const initialState: TodoState = { todos: [], filter: 'all' };

withState(initialState);
```

Every property becomes a read-only signal (`store.todos()`), nested objects become deep signals (`store.user.name()`).

### Updating state with `patchState`

```ts
patchState(store, { filter: 'active' }); // partial object
patchState(store, (state) => ({ todos: [...state.todos, todo] })); // updater function
patchState(store, addEntity(todo), { filter: 'all' }); // several updaters, one update
```

### Local state without a store

```ts
const state = signalState({ count: 0 });
patchState(state, (s) => ({ count: s.count + 1 }));
```

## Computed

```ts
withComputed(({ todos, filter }) => ({
  activeCount: computed(() => todos().filter((t) => !t.completed).length),
  filteredTodos: computed(() =>
    filter() === 'all' ? todos() : todos().filter((t) => (filter() === 'active') !== t.completed),
  ),
})),
// A computed that depends on another computed goes into a second withComputed
withComputed(({ filteredTodos }) => ({
  hasResults: computed(() => filteredTodos().length > 0),
})),
```

## Methods

```ts
withMethods((store, api = inject(TodoApi)) => ({
  addTodo(title: string): Todo {
    const todo = { id: crypto.randomUUID(), title, completed: false };
    patchState(store, { todos: [...store.todos(), todo] });
    return todo;
  },
  toggleTodo(id: string): void {
    patchState(store, (state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  },
  saveAll(): void {
    api.save(store.todos());
  },
})),
```

Dependencies are injected in the factory parameters, or shared through `withProps`. Keep UI feedback such as snackbars in the component; a method can return what it changed so the component knows what to say.

## Props: dependencies and non-state members

```ts
withProps(({ todos }) => ({
  todos$: toObservable(todos),
  _todoService: inject(TodoService), // _ prefix keeps it private
})),
withMethods((store) => ({
  loadTodos: () => store._todoService.loadTodos(),
})),
```

## Hooks and `watchState`

```ts
withHooks((store) => ({
  onInit: () => {
    watchState(store, (state) => console.log('[todo]', state)); // runs on every patchState
    store.loadTodos();
  },
  onDestroy: () => console.log('store destroyed'),
})),
```

## Providing and Using a Store

```ts
@Component({
  selector: 'app-todos',
  providers: [TodoStore], // one instance per component, destroyed with it
  template: `
    <p>{{ store.activeCount() }} active</p>
    @for (todo of store.filteredTodos(); track todo.id) {
      <app-todo [todo]="todo" (toggle)="store.toggleTodo(todo.id)" />
    } @empty {
      <p>No todos</p>
    }
  `,
})
export class Todos {
  protected readonly store = inject(TodoStore);
}
```

`{ providedIn: 'root' }` on the store makes it a singleton instead.

## Async State

### `rxMethod`: RxJS inside the store

```ts
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

withMethods((store, tmdb = inject(TMDBService)) => ({
  load: rxMethod<string>(
    switchMap((query) => {
      patchState(store, { query, isLoading: true });
      const movies$ = query ? tmdb.searchMovies(query) : tmdb.getTrendingMovies();
      return movies$.pipe(
        tapResponse({
          next: ({ results }) => patchState(store, { movies: results }),
          error: (error) => console.error(error),
          finalize: () => patchState(store, { isLoading: false }),
        }),
      );
    }),
  ),
})),
```

The input can be a value, a signal or an observable: `store.load(query)` runs once with the current value of a signal and again on every change. The subscription is cleaned up with the store.

### Debounce with Signal Forms

```ts
import { debounce, form, FormField } from '@angular/forms/signals';

readonly searchModel = signal({ query: '' });
readonly searchForm = form(this.searchModel, (path) => {
  debounce(path.query, 300); // blur and submit flush immediately
});

constructor() {
  this.store.load(computed(() => this.searchModel().query));
}
```

```html
<input matInput [formField]="searchForm.query" />
```

### `signalMethod`: signals only, no RxJS

```ts
logQuery: signalMethod<string>((query) => console.log(query)),
```

### Plain async methods

```ts
async loadTrending(): Promise<void> {
  patchState(store, { isLoading: true });
  try {
    const response = await firstValueFrom(tmdb.getTrendingMovies()); // not toPromise(), removed in RxJS 8
    patchState(store, { movies: response.results });
  } finally {
    patchState(store, { isLoading: false });
  }
},
```

Fine for a one-off load. Without `try`/`finally` a failed request leaves the loading flag set, and nothing cancels the request when the store is destroyed.

### Resource extensions (experimental)

```ts
import { extendResource, withPreviousValueOnLoading, withValueOnError } from '@ngrx/signals/resource';

withProps(({ query }) => ({
  _books: extendResource(
    httpResource<Book[]>(() => `/api/books?q=${query()}`),
    withPreviousValueOnLoading(), // keep the last value while reloading
    withValueOnError([]), // fallback instead of throwing
  ),
})),
```

App-wide defaults: `provideResourceExtensions(withValueOnError(undefined))`.

### Loading, error and success

```ts
interface State {
  items: Item[];
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}
```

## Entities

```ts
import { addEntity, entityConfig, removeEntity, updateEntity, withEntities } from '@ngrx/signals/entities';

export const TodoStore = signalStore(
  withEntities<Todo>(), // entities(), entityMap(), ids(); Todo needs an id
  withMethods((store) => ({
    addTodo: (todo: Todo) => patchState(store, addEntity(todo)),
    toggleTodo: (id: string) => patchState(store, updateEntity({ id, changes: (t) => ({ completed: !t.completed }) })),
    removeTodo: (id: string) => patchState(store, removeEntity(id)),
  })),
);
```

Updaters: `addEntity`, `addEntities`, `setEntity`, `setEntities`, `setAllEntities`, `updateEntity`, `updateEntities`, `updateAllEntities`, `removeEntity`, `removeEntities`, `removeAllEntities`.

### Named collections and custom ids with `entityConfig`

```ts
const todoEntity = entityConfig({
  entity: type<Todo>(),
  collection: 'todo', // prefixes the members: todoEntities, todoEntityMap, todoIds
  selectId: (todo) => todo.id, // only needed without an id property
});

export const TodoStore = signalStore(withEntities(todoEntity));

patchState(store, addEntity(todo, todoEntity)); // every updater takes the config
```

## Custom Features

```ts
type SelectedEntityState = { selectedEntityId: EntityId | null };

export function withSelectedEntity<Entity>() {
  return signalStoreFeature(
    { state: type<EntityState<Entity>>() }, // what the feature requires from the store
    withState<SelectedEntityState>({ selectedEntityId: null }),
    withComputed(({ entityMap, selectedEntityId }) => ({
      selectedEntity: computed(() => {
        const id = selectedEntityId();
        return id ? entityMap()[id] : null;
      }),
    })),
  );
}

// A custom updater for atomic updates
export function selectEntity(selectedEntityId: EntityId | null): SelectedEntityState {
  return { selectedEntityId };
}

patchState(store, addEntity(todo, todoEntity), selectEntity(todo.id));
```

Ready-made features: [ngrx-toolkit](https://github.com/ngrx-toolkit/core) with `withDevtools`, `withStorageSync`, `withUndoRedo`, `withResource` and more.

## Events Plugin

Event-driven flows for the Signal Store, stable since NgRx 21. Package: `@ngrx/signals/events`.

```ts
// Events
export const bookSearchEvents = eventGroup({
  source: 'Book Search',
  events: { opened: type<void>(), queryChanged: type<string>() },
});
export const booksApiEvents = eventGroup({
  source: 'Books API',
  events: { loadedSuccess: type<Book[]>(), loadedFailure: type<string>() },
});

export const BookSearchStore = signalStore(
  withState<State>({ query: '', books: [], isLoading: false }),
  // Reducer: events to state changes
  withReducer(
    on(bookSearchEvents.opened, () => ({ isLoading: true })),
    on(bookSearchEvents.queryChanged, ({ payload: query }) => ({ query, isLoading: true })),
    on(booksApiEvents.loadedSuccess, ({ payload: books }) => ({ books, isLoading: false })),
    on(booksApiEvents.loadedFailure, () => ({ isLoading: false })),
  ),
  // Event handlers: side effects, whatever the stream emits is dispatched again
  withEventHandlers((store, events = inject(Events), booksService = inject(BooksService)) => ({
    loadBooksByQuery$: events.on(bookSearchEvents.opened, bookSearchEvents.queryChanged).pipe(
      switchMap(() =>
        booksService.getByQuery(store.query()).pipe(
          mapResponse({
            next: (books) => booksApiEvents.loadedSuccess(books),
            error: (error: { message: string }) => booksApiEvents.loadedFailure(error.message),
          }),
        ),
      ),
    ),
  })),
);
```

```ts
// Dispatching from the view
export class BookSearch {
  readonly dispatch = injectDispatch(bookSearchEvents); // or inject(Dispatcher).dispatch(event)
  readonly store = inject(BookSearchStore);

  constructor() {
    this.dispatch.opened();
  }
}
```

## Devtools

```ts
import { withDevtools } from '@ngrx-toolkit/core';

export const MediaStore = signalStore({ providedIn: 'root' }, withDevtools('media'), withState(initialState));
```

Needs the Redux DevTools browser extension. Recording starts once the Redux tab of the browser DevTools is open; the store appears there as the instance "NgRx Signal Store".

## Architecture Rules

- Avoid global stores that share everything with everyone.
- Split large stores into smaller ones: one store per feature or component.
- Provide stores as narrowly as possible; `providedIn: 'root'` only for truly global state.
- Share behaviour through features, not by injecting stores into stores.
- Reach for the events plugin when several stores must react to the same thing.
