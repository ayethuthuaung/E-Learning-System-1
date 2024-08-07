import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:8080/api/courses';

  constructor(private http: HttpClient) {}

  //PK (Auto Refresh)
  pollCourses(interval: number, status: string): Observable<Course[]> {
    return timer(0, interval).pipe(
      switchMap(() => this.getAllCourses(status))
    );
  }
  //-------------

  getAllCourses(status: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courselist?status=`+ status);
  }

  getAcceptInstructorCourses(userId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/instructorAcceptCourseList`, {
      params: { userId: userId.toString()}
    });
  }

  getInstructorCourses(userId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/instructorcourselist`, {
      params: { userId: userId.toString()}
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

  
  getCourseIdByExamId(examId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/requestWithExamId/${examId}`);
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
  getMonthlyCourseCounts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/monthly-counts`);
  }

  exportCoursesForInstructor(userId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/courses`, {
      params: { userId: userId.toString() },
      responseType: 'blob'
    });
  }

  exportCoursesForInstructorPDf(userId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/courses/pdf`, {
      params: { userId: userId.toString() },
      responseType: 'blob'
    });
  }
  
 // In your Angular service
 exportStudentListByAdmin(): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/export/student-list/excel`, {
    responseType: 'blob'  // Specify the response type as blob
  });
}

exportStudentListByAdminPdf(): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/export/student-list/pdf`, {
    responseType: 'blob'  // Specify the response type as blob
  });
}

exportAttendStudentList(): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/export/attended-students/excel`, {
    responseType: 'blob' // Specify the response type as blob
  });
}

exportAttendStudentListPdf(): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/export/attend-students/pdf`, {
    responseType: 'blob'
  });
}
  
 
}
