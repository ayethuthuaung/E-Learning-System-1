import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private baseUrl = 'http://localhost:8080/api/lessons';

  constructor(private http: HttpClient) {}
  
  createLesson(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/createLesson`, formData, {
        headers: new HttpHeaders({
            'Accept': 'application/json'
        })
    });
}

getAllLessons(): Observable<Lesson[]> {
  console.log("Hi");
  
  return this.http.get<Lesson[]>(`${this.baseUrl}/getAllLessons`);
}

getLessonsByCourseId(courseId: number,userId:number): Observable<Lesson[]> {
  console.log(`Fetching lessons for course ID: ${courseId}`);
  return this.http.get<Lesson[]>(`${this.baseUrl}/getLesonsByCourse/${courseId}/user/${userId}`);
}

getLessonById(lessonId: number): Observable<Lesson> {
  return this.http.get<Lesson>(`${this.baseUrl}/${lessonId}`);
}

}
