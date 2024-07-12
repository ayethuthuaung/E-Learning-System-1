import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserCourseModuleService {
  private baseUrl = 'http://localhost:8080/api/userCourseModules';

  constructor(private http: HttpClient) {}

  markModuleAsDone(userId: number, moduleId: number): Observable<any> {
    const body = { userId, moduleId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/markAsDone`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

