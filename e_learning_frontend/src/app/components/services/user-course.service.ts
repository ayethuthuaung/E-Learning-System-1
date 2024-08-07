import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UserCourse } from '../models/usercourse.model';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class UserCourseService {
  private baseURL = 'http://localhost:8080/api/user-course';
  http: any;

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

  checkEnrollmentAcceptance(userId: number, courseId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.baseURL}/check-enrollment-acceptance/${userId}/${courseId}`);
  }

  getAcceptedUserCounts(): Observable<{ [courseName: string]: number }> {
    return this.httpClient.get<{ [courseName: string]: number }>(`${this.baseURL}/accepted-user-counts`);
  }
  
  getTrendingCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${this.baseURL}/trending-courses`);
  }

  getAcceptedStudentCounts(): Observable<{ [key: string]: number }> {
    return this.httpClient.get<{ [key: string]: number }>(`${this.baseURL}/accepted-student-counts`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching accepted student counts:', error);
          return throwError('Something went wrong while fetching accepted student counts.');
        })
      );
  } 

  getCourseAttendanceByInstructor(userId: number): Observable<{ [courseName: string]: number }> {
    return this.httpClient.get<{ [courseName: string]: number }>(`${this.baseURL}/course-attendance/${userId}`);
  }

  getMonthlyStudentCounts(): Observable<{ [key: string]: number }> {
    return this.httpClient.get<{ [key: string]: number }>(`${this.baseURL}/monthly-student-counts`);
  }

  getAllAcceptedUserCourses(): Observable<UserCourse[]> {
    return this.httpClient.get<UserCourse[]>(`${this.baseURL}/accepted-UserCourses`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching accepted user courses:', error);
          return throwError('Something went wrong while fetching accepted user courses.');
        })
      );
  }

}
