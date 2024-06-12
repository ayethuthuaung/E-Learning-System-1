import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private baseURL = "http://localhost:8080/courses";

  constructor(private httpClient: HttpClient) { }
  
  getCourseList(): Observable<Course[]>{
    return this.httpClient.get<Course[]>(`${this.baseURL}/courselist`);
  }

  createCourse(course: Course): Observable<Object>{
    return this.httpClient.post(`${this.baseURL}/addcourse`, course);
  }

  getCourseById(id: number): Observable<Course>{
    return this.httpClient.get<Course>(`${this.baseURL}/getbyid/${id}`);
  }

  updateCourse(id: number, course: Course): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/updatecourse/${id}`, course);
  }

  deleteCourse(id: number): Observable<Object>{
    return this.httpClient.delete(`${this.baseURL}/deleteuser/${id}`);
  }
  getCoursesByCategory(categoryId: number): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${this.baseURL}/getCoursesByCategory/${categoryId}`);
  }

  addCategoryToCourse(courseId: number, categoryId: number): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}/addCategoryToCourse`, { courseId, categoryId });
  }
}