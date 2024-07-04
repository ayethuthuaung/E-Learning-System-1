import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  softDeleteCourse(id: number): Observable<Object> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
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
