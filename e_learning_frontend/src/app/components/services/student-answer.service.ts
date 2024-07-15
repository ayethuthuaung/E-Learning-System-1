import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentAnswer } from '../models/student-answer.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentAnswerService {

  private baseURL = "http://localhost:8080/api/student-answers";
  constructor(private httpClient: HttpClient) { }

  submitStudentAnswers(studentAnswers: StudentAnswer[]): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/submitAnswers`, studentAnswers, { responseType: 'json' });
  }

}
