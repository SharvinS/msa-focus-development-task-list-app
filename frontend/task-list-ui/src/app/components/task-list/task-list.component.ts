import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../../shared/material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    TaskFormComponent,
    HttpClientModule,
    MaterialModule,
    FormsModule,
  ],
  templateUrl: './task-list.component.html',
  providers: [DatePipe, TaskService],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  selectAll = false;

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.checkIfAllTasksCompleted();
    });
  }

  handleTaskCreated(task: Task) {
    this.taskService.addTask(task).subscribe(() => this.loadTasks());
    this.showMessage('Task added successfully');
  }

  toggleTaskCompletion(task: Task): void {
    task.isCompleted = !task.isCompleted;
    this.taskService.updateTask(task).subscribe({
      next: () => {
        this.checkIfAllTasksCompleted();
        this.showMessage('Task updated successfully');
      },
      error: (err) => console.error('Update failed:', err),
    });
  }

  toggleAllTasks() {
    this.tasks.forEach((task) => {
      task.isCompleted = this.selectAll;
      this.taskService.updateTask(task).subscribe();
    });
    this.showMessage('All tasks updated');
    this.checkIfAllTasksCompleted();
  }

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
  }

  checkIfAllTasksCompleted() {
    if (this.tasks.length === 0) {
      this.selectAll = false;
    } else {
      this.selectAll = this.tasks.every((task) => task.isCompleted);
    }
  }

  deleteTask(task: Task): void {
    if (!task.isCompleted) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent);

      dialogRef.afterClosed().subscribe((result) => {
        if (!result) return;

        this.taskService.deleteTask(task.id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter((t) => t.id !== task.id);
            this.showMessage('Task deleted successfully');
            this.checkIfAllTasksCompleted();
          },
          error: (err) => console.error('Delete failed:', err),
        });
      });
    } else {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter((t) => t.id !== task.id);
          this.showMessage('Task deleted successfully');
          this.checkIfAllTasksCompleted();
        },
        error: (err) => console.error('Delete failed:', err),
      });
    }
  }
}
