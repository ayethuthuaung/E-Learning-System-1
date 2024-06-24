import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:8080/courses';

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}`);
  }

  getCourseList(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`);
  }

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}`, course);
  }

  addCourseWithFormData(formData: FormData): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}`, formData);
  }

  updateCourse(id: number, course: Course): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, course);
  }

  softDeleteCourse(id: number): Observable<Object> {
    return this.http.delete(`${this.baseUrl}/${id}`);
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
}
