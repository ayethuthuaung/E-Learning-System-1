import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCourse } from '../models/usercourse.model';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class UserCourseService {
  private baseURL = 'http://localhost:8080/api/user-course';

  constructor(private httpClient: HttpClient) { }

  enrollUserInCourse(userId: number, courseId: number): Observable<UserCourse> {
    return this.httpClient.post<UserCourse>(`${this.baseURL}/enroll`, { userId, courseId });
  }

  getAllUserCourses(userId: any): Observable<UserCourse[]> {
    console.log(userId);
    
    return this.httpClient.get<UserCourse[]>(`${this.baseURL}/userCourselist?userId=${userId}`);
  }

  changeStatus(id: number, status: string): Observable<void> {
    return this.httpClient.post<void>(`${this.baseURL}/change-status/${id}`, { status });
  }  

  updateUserCourse(userCourseId: number, completed: boolean, progress: number, status: string): Observable<UserCourse> {
    return this.httpClient.put<UserCourse>(`${this.baseURL}/update/${userCourseId}`, { completed, progress, status });
  }

  getUserById(userId: number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseURL}/user/${userId}`);
  }

  getCourseById(courseId: number): Observable<Course> {
    return this.httpClient.get<Course>(`${this.baseURL}/course/${courseId}`);
  }

  getCoursesByUserId(userId: number): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${this.baseURL}/user/${userId}/courses`);
  }
 
  checkEnrollment(userId: number, courseId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseURL}/check?userId=${userId}&courseId=${courseId}`);
  }
  checkEnrollmentAcceptance(userId: number, courseId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseURL}/check-enrollment-acceptance/${userId}/${courseId}`);
  }
}
