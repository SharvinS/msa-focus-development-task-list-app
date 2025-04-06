import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  taskForm!: FormGroup;
  @Output() taskCreated = new EventEmitter<Task>(); // Tells the parent when a task is created

  submitted = false; // Keep track if the form was submitted
  validAlphanumericPattern = /^[a-zA-Z0-9 ]*$/; // Only letters, numbers and spaces allowed

  constructor(private fb: FormBuilder) {}

  newTask: Task = {
    id: 0,
    title: '',
    dueDate: '',
    isCompleted: false,
  };

  // Only allow alphanumeric input
  keyPressAlphanumeric(event: any) {
    const inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9\s]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // Make sure the due date is in the future
  validateFutureDate(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const selectedDate = new Date(control.value);
    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  }

  ngOnInit() {
    // Set up the form with some rules
    this.taskForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.pattern(this.validAlphanumericPattern),
          Validators.maxLength(100)
        ],
      ],
      dueDate: ['', [Validators.required, this.validateFutureDate]],
    });
  }

  onSubmit() {
    this.submitted = true; // Form is attempted for submittion

    if (this.taskForm.valid) {
      // Get the values from the form
      this.newTask.title = this.taskForm.get('title')?.value;
      this.newTask.dueDate = this.taskForm.get('dueDate')?.value;

      this.taskCreated.emit(this.newTask); // Send the new task to the parent

      // Reset the form and get ready for the next task
      this.newTask = {
        id: 0,
        title: '',
        dueDate: '',
        isCompleted: false,
      };
      this.taskForm.reset();
      this.submitted = false;
    }
  }
}
