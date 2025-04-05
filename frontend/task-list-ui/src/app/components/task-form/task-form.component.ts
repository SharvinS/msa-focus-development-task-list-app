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
  @Output() taskCreated = new EventEmitter<Task>();

  submitted = false;
  validAlphanumericPattern = /^[a-zA-Z0-9 ]*$/;

  constructor(private fb: FormBuilder) {}

  newTask: Task = {
    id: 0,
    title: '',
    dueDate: '',
    isCompleted: false,
  };

  keyPressAlphanumeric(event: any) {
    const inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9\s]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  validateFutureDate(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const selectedDate = new Date(control.value);
    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  }

  ngOnInit() {
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
    this.submitted = true;

    if (this.taskForm.valid) {
      this.newTask.title = this.taskForm.get('title')?.value;
      this.newTask.dueDate = this.taskForm.get('dueDate')?.value;

      this.taskCreated.emit(this.newTask);

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
