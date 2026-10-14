import { computed, isDevMode } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { withDevtools } from '@ngrx-toolkit/core';
import { Todo } from '../../models/todo.model';

type TodoFilter = 'all' | 'active' | 'completed';

interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
}

const initialState: TodoState = {
  todos: [],
  filter: 'all',
};

// Provided per component (see todo-list.ts): UI state that dies with the component.
// User feedback stays in the component: the methods return what they changed.
export const TodoStore = signalStore(
  withDevtools('todo'),
  withState(initialState),
  withProps(({ todos }) => ({
    todos$: toObservable(todos),
  })),
  withComputed(({ filter, todos }) => ({
    activeCount: computed(
      () => todos().filter((todo) => !todo.completed).length,
    ),
    completedCount: computed(
      () => todos().filter((todo) => todo.completed).length,
    ),
    filteredTodos: computed(() => {
      switch (filter()) {
        case 'active':
          return todos().filter((todo) => !todo.completed);
        case 'completed':
          return todos().filter((todo) => todo.completed);
        default:
          return todos();
      }
    }),
  })),
  withMethods((state) => ({
    addTodo: (title: string): Todo => {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: new Date(),
      };

      patchState(state, { todos: [...state.todos(), newTodo] });

      return newTodo;
    },

    toggleTodo: (id: string): Todo | undefined => {
      const todo = state.todos().find((todo) => todo.id === id);
      if (!todo) {
        return undefined;
      }

      const updated: Todo = { ...todo, completed: !todo.completed };

      patchState(state, {
        todos: state.todos().map((t) => (t.id === id ? updated : t)),
      });

      return updated;
    },

    removeTodo: (id: string): Todo | undefined => {
      const todo = state.todos().find((todo) => todo.id === id);
      if (!todo) {
        return undefined;
      }

      patchState(state, {
        todos: state.todos().filter((t) => t.id !== id),
      });

      return todo;
    },

    setFilter: (filter: TodoFilter): void => {
      patchState(state, { filter });
    },

    clearCompleted: (): number => {
      const count = state.completedCount();
      if (count === 0) {
        return 0;
      }

      patchState(state, {
        todos: state.todos().filter((todo) => !todo.completed),
      });

      return count;
    },
  })),
  withHooks((state) => ({
    onInit: () => {
      if (isDevMode()) {
        watchState(state, () => {
          console.log('Todo State:', state.todos());
        });
      }

      patchState(state, {
        todos: [
          {
            id: '1',
            title: 'Learn Angular Signals',
            completed: false,
            createdAt: new Date(),
          },
          {
            id: '2',
            title: 'Learn NgRx Signal Store',
            completed: false,
            createdAt: new Date(),
          },
        ],
      });
    },
  })),
);
