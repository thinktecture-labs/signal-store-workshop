import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { TodoStore } from './todo-store';

/**
 * TodoList refactored to use the TodoStore.
 * Same template and styles as src/app/components/todo, the component signals
 * and methods are replaced by the store.
 */
@Component({
  selector: 'app-todo-list-with-store',
  templateUrl: './todo-list-with-store.html',
  styleUrl: '../../../src/app/components/todo-list/todo-list.scss',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatDividerModule,
  ],
  providers: [TodoStore],
})
export default class TodoListWithStore {
  protected readonly store = inject(TodoStore);
  private readonly snackBar = inject(MatSnackBar);

  readonly newTodoTitle = signal('');

  addTodo() {
    const title = this.newTodoTitle().trim();
    if (!title) {
      return;
    }

    const todo = this.store.addTodo(title);
    this.newTodoTitle.set('');
    this.notify(`Added todo: ${todo.title}`);
  }

  toggleTodo(id: string) {
    const todo = this.store.toggleTodo(id);
    if (todo) {
      this.notify(
        `Marked "${todo.title}" as ${todo.completed ? 'completed' : 'active'}`,
      );
    }
  }

  removeTodo(id: string) {
    const todo = this.store.removeTodo(id);
    if (todo) {
      this.notify(`Removed todo: ${todo.title}`);
    }
  }

  clearCompleted() {
    const count = this.store.clearCompleted();
    if (count > 0) {
      this.notify(`Cleared ${count} completed todo${count === 1 ? '' : 's'}`);
    }
  }

  private notify(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
