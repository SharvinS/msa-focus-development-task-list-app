import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Task } from '../models/task.model';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:5003/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      catchError(this.handleError) 
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http
      .post<Task>(this.apiUrl, task)
      .pipe(catchError(this.handleError));
  }

  deleteTask(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateTask(task: Task): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/${task.id}`, task)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong, please try again later.');
  }
}
