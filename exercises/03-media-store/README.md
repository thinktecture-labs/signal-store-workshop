# Exercise 3: Building a MediaStore

In this exercise, you will create a new NgRx Signal Store to manage movie and TV show data, replacing the complex RxJS patterns in the current `MediaOverview`.

## Objective

Learn how to:

- Create a SignalStore for handling async data from an API
- Use `rxMethod` with a signal input to load trending titles and search results
- Replace RxJS-heavy patterns with a more declarative approach
- Implement loading states and error handling

## Background

The application currently uses RxJS observables in the `MediaOverview` to manage the state of trending and searched movies and TV shows. This approach works but can be complex and verbose.

Your task is to create a MediaStore that centralizes this state management logic, making it more maintainable and easier to understand.

## Instructions

1. **Explore the component**: `src/app/components/media-overview/media-overview.ts` debounces the search field with a Signal Forms `debounce` rule and turns the query signal into one RxJS pipeline per list: trending titles while the query is empty, search results otherwise.

2. **Complete the store** in `src/app/components/media-overview/media-store.ts`, next to the component it belongs to, following the TODOs:
   - A `MediaState` interface with the query, the movies and shows to display and a loading flag per list, and its initial state
   - `withProps` to inject `TMDBService` as `_tmdb`: members starting with an underscore stay private to the store
   - `withComputed` for an `isLoading` flag across both lists
   - `withMethods`: `load` as an `rxMethod<string>` with `switchMap` and `tapResponse`, one method for the trending lists and every search

3. **Refactor the component** to use the store:
   - Add `MediaStore` to the component's `providers`: the media overview is the feature that owns this state
   - Inject the store and pass the query signal to `load()`: an `rxMethod` called with a signal runs once with the current value and again on every change, so the empty query loads the trending lists
   - Replace the observables and the async pipe in the template with the store's signals

4. **Try it** on <http://localhost:4200>: trending movies and shows, a search, and the loading states while the results arrive.

5. **Compare with the solution** in `exercises/03-media-store/solution/`: `media-store.ts` is the finished store, `media-overview-with-store.ts` and `media-overview-with-store.html` the refactored component, so a diff against your `media-overview.ts` and `media-overview.html` shows exactly the lab's changes. The solution goes one step further than the TODOs: the movies and shows halves are the same logic, so it extracts them into a custom `withMediaList` feature built with `signalStoreFeature`.

<details>
<summary>Tips</summary>

- Start by analyzing the existing `MediaOverview` to understand its functionality
- Use the `rxMethod` function from `@ngrx/signals/rxjs-interop` for the loading
- The debounce stays in the form schema: it is UI behaviour, and the store only sees settled queries
- Set the loading flags inside `switchMap`, not in a `tap` before it: `switchMap` first cancels the previous request, whose `finalize` clears them
- Use the `tapResponse` operator per request so that one failing list does not stop the other
- Make sure to handle loading states properly for a good user experience

</details>

## Bonus Challenges

If you finish early, try these additional challenges:

1. Add error handling to the store
2. Implement pagination for search results
3. Add sorting and filtering capabilities
4. Implement caching of previous search results

## Resources

- [NgRx Signal Store Documentation](https://ngrx.io/guide/signals/signal-store)
- [RxJS Integration Guide](https://ngrx.io/guide/signals/rxjs-integration)
- [withMethods Documentation](https://ngrx.io/api/signals/withMethods)
- [rxMethod Documentation](https://ngrx.io/api/signals/rxjs-interop/rxMethod)
