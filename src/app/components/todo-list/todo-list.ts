import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatDividerModule,
  ],
})
export default class TodoList {
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  readonly newTodoTitle = signal('');

  // Private signals for internal state management
  private readonly todosSignal = signal<Todo[]>([
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
  ]);
  private readonly filterSignal = signal<'all' | 'active' | 'completed'>('all');

  // Public read-only signals
  readonly todos = this.todosSignal.asReadonly();
  readonly filter = this.filterSignal.asReadonly();

  // Computed signals for derived state
  readonly filteredTodos = computed(() => {
    const filter = this.filterSignal();
    const todos = this.todosSignal();

    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  });

  readonly completedCount = computed(
    () => this.todosSignal().filter((todo) => todo.completed).length,
  );

  readonly activeCount = computed(
    () => this.todosSignal().filter((todo) => !todo.completed).length,
  );

  addTodo() {
    const title = this.newTodoTitle().trim();
    if (!title) {
      return;
    }
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };

    this.todosSignal.update((todos) => [...todos, newTodo]);
    this.notify(`Added todo: ${newTodo.title}`);
    this.newTodoTitle.set('');
  }

  toggleTodo(id: string) {
    this.todosSignal.update((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          const updated = { ...todo, completed: !todo.completed };
          const status = updated.completed ? 'completed' : 'active';
          this.notify(`Marked "${todo.title}" as ${status}`);
          return updated;
        }
        return todo;
      }),
    );
  }

  removeTodo(id: string) {
    const todoToRemove = this.todosSignal().find((todo) => todo.id === id);
    if (todoToRemove) {
      this.todosSignal.update((todos) =>
        todos.filter((todo) => todo.id !== id),
      );
      this.notify(`Removed todo: ${todoToRemove.title}`);
    }
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.filterSignal.set(filter);
  }

  clearCompleted() {
    const count = this.completedCount();
    if (count > 0) {
      this.todosSignal.update((todos) =>
        todos.filter((todo) => !todo.completed),
      );
      this.notify(`Cleared ${count} completed todo${count === 1 ? '' : 's'}`);
    }
  }

  private notify(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
