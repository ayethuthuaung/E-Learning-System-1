import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UserCourseModule } from '../models/usercoursemodule.model';

@Injectable({
  providedIn: 'root'
})
export class UserCourseModuleService {
  private baseUrl = 'http://localhost:8080/api/userCourseModules';

  constructor(private http: HttpClient) {}

  markModuleAsDone(userId: number, moduleId: number): Observable<UserCourseModule> {
    const body = { userId, moduleId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<UserCourseModule>(`${this.baseUrl}/markAsDone`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

 
  getModuleCompletionStatus(userId: number, moduleId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/status/${userId}/${moduleId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
  getCompletionStatus(courseId: number): Observable<{ completed: number; total: number }> {
    return this.http.get<{ completed: number; total: number }>(`${this.baseUrl}/courses/${courseId}/completion-status`);
  }

  isModuleCompleted(moduleId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/modules/${moduleId}/completion-status`);
  }
}