import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionCreationDTO } from '../models/QuestionCreationDTO.model';
import { QuestionDto } from '../models/question.model';
import { StudentAnswer } from '../models/student-answer.model';
import { Exam } from '../models/exam.model';
import { ExamDTO } from '../models/examdto.model';
import { MarksDTO } from '../models/marks.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  

  private baseURL = "http://localhost:8080/api/question";
  constructor(private httpClient: HttpClient) { }

 

  getViewList(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseURL}/viewList`);
  }
  //for answer-form
  getQuestionsForExam(examId: number): Observable<QuestionDto[]> {
    return this.httpClient.get<QuestionDto[]>(`${this.baseURL}/exam/${examId}`);
  }

  
  getQuestionForExam(examId: number): Observable<ExamDTO[]> {
    return this.httpClient.get<ExamDTO[]>(`${this.baseURL}/exam/${examId}`);
  }

  createQuestion(questionCreationDTO: QuestionCreationDTO[]): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}/add`, questionCreationDTO);
  }

  getQuestion(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseURL}/viewOne/${id}`);
  }

  updateQuestion(id: number, question: any): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/update/${id}`, question);
  }

  deleteQuestion(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/delete/${id}`);
  }
 
 
}
