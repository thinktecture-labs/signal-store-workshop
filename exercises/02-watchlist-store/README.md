# Exercise 2 (Bonus): Creating a WatchlistStore

In this exercise, you will convert the existing `WatchlistService` that uses vanilla Angular signals to an NgRx Signal Store implementation.

## Objective

Learn how to:

- Create a SignalStore with state, computed properties, and methods
- Use `patchState` to update store state
- Refactor existing components to work with the new store

## Background

The application currently has a `WatchlistService` that manages a list of movies and TV shows that the user wants to watch. The service uses Angular signals to maintain the state of the watchlist and provides methods to add, remove, and update items.

Your task is to convert this service to use NgRx Signal Store, which provides a more structured approach to state management.

## Instructions

1. **Explore the service**: `src/app/services/watchlist-service.ts` keeps the watchlist in signals and is used by the watchlist page and by the watchlist button on every card.

2. **Complete the store** in `src/app/stores/watchlist-store.ts`, a folder for stores shared across the app, following the TODOs:
   - A `WatchlistState` interface with the array of `WatchlistItem`, and its initial state
   - `withState`, then `withComputed` for the computed properties of the service and `withMethods` for its methods, each changing state through `patchState` and returning the item it changed
   - Keep `{ providedIn: 'root' }`: the button on every card and the watchlist page share one list

3. **Refactor the components** to use the store: inject `WatchlistStore` instead of `WatchlistService` in the watchlist page and the watchlist button and call the store's methods. The snackbar messages move from the service into the two components; the store stays free of UI concerns.

4. **Try it**: add items from the cards, toggle the watched status and remove items on <http://localhost:4200/watchlist>.

5. **Compare with the solution** in `exercises/02-watchlist-store/solution/`: `watchlist-store.ts` is the finished store, `watchlist-example.ts` a small component using it. The solution goes one step further and keeps the items with `withEntities` from part 2: the duplicate check, removal and toggle become `addEntity`, `removeEntity` and `updateEntity`, and lookups read the entity map. A movie and a TV show can share a TMDB id, so the entity id combines type and id.

<details>
<summary>Tips</summary>

- Start by looking at the existing `WatchlistService` to understand its functionality
- The SignalStore pattern follows a similar structure to the existing service, but with a more declarative approach
- Use the `patchState` function to update the store state immutably
- Use `{ providedIn: 'root' }` here: the watchlist button on every card and the watchlist page share one list

</details>

## Bonus Challenges

If you finish early, try these additional challenges:

1. Add persistence using localStorage and the `withHooks` feature
2. Add additional filtering options using `withComputed`
3. Add undo/redo functionality using a command pattern
4. Replace the array with `withEntities` and an `entityConfig` whose `selectId` combines type and id

## Resources

- [NgRx Signal Store Documentation](https://ngrx.io/guide/signals/signal-store)
- [withState Documentation](https://ngrx.io/api/signals/withState)
- [withComputed Documentation](https://ngrx.io/api/signals/withComputed)
- [withMethods Documentation](https://ngrx.io/api/signals/withMethods)
