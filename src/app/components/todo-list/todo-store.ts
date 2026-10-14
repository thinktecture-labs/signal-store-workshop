/* eslint-disable @typescript-eslint/no-unused-vars -- remove this line once the TODOs are done */
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Todo } from '../../models/todo.model';

/**
 * Define the TodoState interface
 */
export interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

/**
 * Define the initial state
 */
export const initialState: TodoState = {
  todos: [],
  filter: 'all',
};

/**
 * Create the TodoStore
 *
 * The state and withState are in place. Implement:
 * - withComputed: to create derived values
 * - withMethods: to define operations for state updates
 */
export const TodoStore = signalStore(
  withState(initialState),

  // TODO: Implement withComputed for filteredTodos, completedCount, activeCount
  withComputed(({ todos, filter }) => ({
    // Implementation here
  })),

  // TODO: Implement withMethods for addTodo, toggleTodo, removeTodo, setFilter, clearCompleted.
  // Return what each method changed (the todo, or the count), the component shows the snackbar.
  withMethods((state) => ({
    // Implementation here
  })),
);
