import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:8080/api/courses';

  constructor(private http: HttpClient) {}

  getAllCourses(status: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courselist?status=`+ status);
  }

  

  getInstructorCourses(userId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/instructorcourselist`, {
      params: { userId: userId.toString() }
    });
  }

  changeStatus(id: number, status: string): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/changeStatus?id=${id}&status=${status}`, {});
  }
  

  getCourseList(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courselist`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`);
  }

  addCourseWithFormData(formData: FormData): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/addcourse`, formData);
  }

  updateCourse(id: number, formData: FormData): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/updatecourse/${id}`, formData);
  }

  softDeleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getCoursesByCategory(categoryId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/byCategory/${categoryId}`);
  }

  addCategoryToCourse(courseId: number, categoryId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${courseId}/categories/${categoryId}`, {});
  }

  isCourseNameAlreadyExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/existsByName`, {
      params: { name }
    });
  }

  getLatestAcceptedCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/latestAccepted`);
  }

  getCourseIdByLessonId(lessonId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/lessons/${lessonId}/courseId`);
  }
  
  getCoursesByUserId(userId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/instructorcourselist`, {
      params: { userId: userId.toString() }
    });
  }
  exportCoursesByInstructor(instructorId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/instructor/excel?instructorId=${instructorId}`, { responseType: 'blob' });
  }

  exportAllCourses(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/admin/excel`, { responseType: 'blob' });
  }
  exportCoursesByInstructorToPdf(instructorId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/instructor/pdf?instructorId=${instructorId}`, { responseType: 'blob' });
  }
  exportAllCoursesPDF(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/admin/pdf`, { responseType: 'blob' });
  }
  
  
 
}
