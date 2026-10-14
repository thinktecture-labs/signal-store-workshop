You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- The app is zoneless (`provideZonelessChangeDetection()`), the default since Angular 21. Never rely on Zone.js; drive updates through signals, inputs and events
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Name files after their class without a type suffix: `user-profile.ts`, `user-profile.html` and `user-profile.scss` for a component class `UserProfile`; services and pipes keep their class suffix and get it hyphenated in the file name, as in `tmdb-service.ts` for `TMDBService`
- Use `input()`, `model()` and `output()` functions instead of decorators, and `viewChild()` / `contentChild()` instead of query decorators
- Use `computed()` for derived state
- Components use `OnPush` change detection by default since Angular 22. Do NOT opt out with `changeDetection: ChangeDetectionStrategy.Eager`
- Prefer inline templates for small components
- Prefer Signal Forms (`form()` from `@angular/forms/signals`, stable since Angular 22) for new forms over reactive and template-driven forms; leave the existing forms as they are
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Change signals with `set` or `update`, never by mutating the value in place

## NgRx Signal Store

- State shared by several components, or state of a whole feature, lives in a Signal Store built with `signalStore`, `withState`, `withComputed`, `withMethods` and `withHooks`, not in a service holding signals
- Change store state only through `patchState`; combine several updaters in one `patchState` call
- Provide a store in the component or feature that owns the state; use `{ providedIn: 'root' }` only for truly global state
- Keep a store's file beside the component that provides it, as in `components/todo-list/todo-store.ts`; stores provided in root live in `src/app/stores/`
- Use `rxMethod` from `@ngrx/signals/rxjs-interop` for side effects that need RxJS, `withEntities` for collections, and `signalStoreFeature` for reusable behaviour
- Inject dependencies in the `withMethods` factory parameters or share them through `withProps`

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Templates read signals. Convert observables with `toSignal()` or fetch with `httpResource()` instead of subscribing manually; the `async` pipe is acceptable for an existing observable stream

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
