import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Module } from '../models/module.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Lesson } from '../models/lesson.model';
import { CourseModule } from '../models/coursemodule.model';

@Injectable({
  providedIn: 'root'
})
export class CourseModuleService {

  private baseUrl = 'http://localhost:8080/api/modules';

  constructor(private http: HttpClient) {}

  getModuleById(moduleId: number): Observable<Module> {
    return this.http.get<Module>(`${this.baseUrl}/${moduleId}`);
  }

  createModules(formData: FormData): Observable<any> {
    console.log("Sending FormData:", formData);
    return this.http.post(`${this.baseUrl}/createModules`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total !== undefined) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            console.log(`File is ${percentDone}% uploaded.`);
          }
        } else if (event.type === HttpEventType.Response) {
          console.log('File is completely uploaded!', event.body);
        }
      })
    );
  }
  // createModule(formData: FormData): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/createModule`, formData)
        // headers: new HttpHeaders({
        //     'Accept': 'application/json'
        // })
    // });
// }

  updateModule(moduleId: number, formData : FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${moduleId}`, formData);
  }

  deleteModule(moduleId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${moduleId}`);
  }

  getAllModules(): Observable<Module[]> {
    return this.http.get<Module[]>(this.baseUrl);
  }
  getCompletionPercentage(userId: number, courseId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/completion-percentage?userId=${userId}&courseId=${courseId}`);
  }
 
  getAllStudentsProgress(): Observable<{ [studentName: string]: { [courseName: string]: number } }> {
    return this.http.get<{ [studentName: string]: { [courseName: string]: number } }>(`${this.baseUrl}/all-students-progress`);
  }

  getAllCoursesProgress(): Observable<{ [courseName: string]: { [studentName: string]: number } }> {
    return this.http.get<{ [courseName: string]: { [studentName: string]: number } }>(`${this.baseUrl}/all-courses-progress`);
  }
  

  getModulesByLessonId(lessonId: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.baseUrl}/byLesson/${lessonId}`);
  }

  getLessonsByModuleId(moduleId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/lessons/${moduleId}`);
  }

  getModulesByCourseId(courseId: number): Observable<CourseModule[]> {
    return this.http.get<CourseModule[]>(`${this.baseUrl}/byCourse/${courseId}`);
  }
}
