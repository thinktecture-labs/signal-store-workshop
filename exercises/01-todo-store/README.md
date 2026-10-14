# Exercise 1: Migrating Component Signals to Signal Store

In this exercise, you will learn how to migrate from component-level signals to NgRx Signal Store for more structured state management.

## Objective

Learn how to:

- Extract component state into a Signal Store
- Implement state management with NgRx Signal Store
- Use `patchState` for immutable state updates
- Create computed values with Signal Store
- Define methods for state operations

## Background

The application has a Todo component that manages its state using component-level signals. This approach works well for simple components, but as the application grows, managing state at the component level can become cumbersome.

NgRx Signal Store provides a more structured and scalable approach to state management, with clear separation of concerns and improved testability.

## Instructions

1. **Explore the component**: `src/app/components/todo-list/todo-list.ts` and its template keep the todos, the filter and the counts in component signals, with the operations as methods.

2. **Complete the store** in `src/app/components/todo-list/todo-store.ts`, next to the component it belongs to, following the TODOs:
   - The state interface, the initial state and `withState(initialState)` are already in place; every state property becomes a read-only signal on the store
   - `withComputed`: `filteredTodos` for the current filter, `completedCount` and `activeCount`
   - `withMethods`: `addTodo`, `toggleTodo`, `removeTodo`, `setFilter` and `clearCompleted`, each changing state through `patchState` and returning what it changed: the added, toggled or removed todo, or the number of cleared todos

3. **Refactor the component** to use the store:
   - Add `TodoStore` to the component's `providers`, not `providedIn: 'root'`: it is UI state that lives and dies with the component
   - Inject the store and replace the component's signals, computed values and methods with the store's members, in the class and in the template
   - Keep `newTodoTitle` in the component: it is form state, not todo state
   - Keep the snackbar messages in the component as well: user feedback is a UI concern, and the store's return values tell you what to say

4. **Try it** on <http://localhost:4200/todos>: add, toggle, remove and filter todos, clear the completed ones.

5. **Compare with the solution** in `exercises/01-todo-store/solution/`: `todo-store.ts` is the finished store, `todo-list-with-store.ts` and `todo-list-with-store.html` the refactored component, so a diff against your `todo-list.ts` and `todo-list.html` shows exactly the lab's changes.

<details>
<summary>Hint: the component signals next to their store version</summary>

### Component-level Signals:

```typescript
// Component-level state management
private todosSignal = signal<Todo[]>([]);
private filterSignal = signal<'all' | 'active' | 'completed'>('all');

readonly filteredTodos = computed(() => {
  const filter = this.filterSignal();
  const todos = this.todosSignal();

  switch (filter) {
    // filtering logic
  }
});

addTodo() {
  this.todosSignal.update(todos => [...todos, newTodo]);
}
```

### Signal Store:

```typescript
// Signal Store state management
export const TodoStore = signalStore(
  withState<TodoState>({ todos: [], filter: 'all' }),

  withComputed(({ todos, filter }) => ({
    filteredTodos: computed(() => {
      // filtering logic
    }),
  })),

  withMethods(({ todos, ...store }) => ({
    addTodo(title: string) {
      patchState(store, { todos: [...todos(), newTodo] });
    },
  })),
);
```

</details>

## Key Benefits of Signal Store

1. **Separation of Concerns**: Separate state management from component logic
2. **Improved Testability**: Test state logic independently of components
3. **Better Organization**: Group related state and logic
4. **Reusability**: Share state across multiple components
5. **Predictable Updates**: Immutable updates with `patchState`
6. **Dependency Injection**: Leverage Angular's DI system for state management

## Bonus Challenges

If you finish early, try these additional challenges:

1. Add persistence using localStorage and the `withHooks` feature
2. Implement an undo feature to restore deleted todos
3. Add support for todo categories or tags
4. Add a search function with highlighting

## Resources

- [NgRx Signal Store Documentation](https://ngrx.io/guide/signals/signal-store)
- [Angular Signals](https://angular.io/guide/signals)
- [withState Documentation](https://ngrx.io/api/signals/withState)
- [withComputed Documentation](https://ngrx.io/api/signals/withComputed)
- [withMethods Documentation](https://ngrx.io/api/signals/withMethods)
