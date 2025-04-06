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
  selectAll = false; // Tracks if all tasks are selected

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks(); // Load all existing tasks on screen load
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.checkIfAllTasksCompleted(); // Check if all tasks are done
    });
  }

  handleTaskCreated(task: Task) {
    this.taskService.addTask(task).subscribe(() => this.loadTasks()); // Add the new task and refresh the list
    this.showMessage('Task added successfully');
  }

  toggleTaskCompletion(task: Task): void {
    task.isCompleted = !task.isCompleted; // Flip the completion status
    this.taskService.updateTask(task).subscribe({
      next: () => {
        this.checkIfAllTasksCompleted(); // Check if all tasks are done
        this.showMessage('Task updated successfully');
      },
      error: (err) => console.error('Update failed:', err),
    });
  }

  toggleAllTasks() {
    this.tasks.forEach((task) => {
      task.isCompleted = this.selectAll; // Set all tasks to the same completion status
      this.taskService.updateTask(task).subscribe();
    });
    this.showMessage('All tasks updated');
    this.checkIfAllTasksCompleted(); // Check if all tasks are done
  }

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 3000 }); // Show a message to the user
  }

  checkIfAllTasksCompleted() {
    if (this.tasks.length === 0) {
      this.selectAll = false; // Nothing to select if there are no tasks
    } else {
      this.selectAll = this.tasks.every((task) => task.isCompleted); // Check are all tasks done
    }
  }

  deleteTask(task: Task): void {
    if (!task.isCompleted) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent); // Confirm before deleting

      dialogRef.afterClosed().subscribe((result) => {
        if (!result) return; // User canceled, do nothing

        this.taskService.deleteTask(task.id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter((t) => t.id !== task.id); // Remove the task from the list
            this.showMessage('Task deleted successfully');
            this.checkIfAllTasksCompleted(); // Check if all tasks are done
          },
          error: (err) => console.error('Delete failed:', err),
        });
      });
    } else {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter((t) => t.id !== task.id); // Remove the task from the list
          this.showMessage('Task deleted successfully');
          this.checkIfAllTasksCompleted(); // Check if all tasks are done
        },
        error: (err) => console.error('Delete failed:', err),
      });
    }
  }
}
