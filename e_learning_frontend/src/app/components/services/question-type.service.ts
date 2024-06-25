import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, catchError, throwError } from 'rxjs';


import { Question_Type } from '../models/question-type.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionTypeService {

  private baseURL = "http://localhost:8080/questionType";

  constructor(private httpClient: HttpClient) { }

  getQuestionTypes(): Observable<Question_Type[]> {
    return this.httpClient.get<Question_Type[]>(`${this.baseURL}/viewList`);
  }

  
  getQuestionTypeList(): Observable<Question_Type[]>{
    return this.httpClient.get<Question_Type[]>(`${this.baseURL}/viewList`);
  }

  createQuestionType(questionType: Question_Type): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}/add`, questionType).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    return throwError('Something bad happened; please try again later.');
  }
  

  getQuestionType(id: number): Observable<Question_Type>{
    return this.httpClient.get<Question_Type>(`${this.baseURL}/viewOne/${id}`);
  }

  updateQuestionType(id: number, questionType: Question_Type): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/update/${id}`, questionType);
  }

  deleteQuestionType(id: number): Observable<Object>{
    return this.httpClient.delete(`${this.baseURL}/delete/${id}`);
  }
}