// src/app/services/answer-option.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnswerOptionDTO } from '../models/answerOption.model';

@Injectable({
  providedIn: 'root'
})
export class AnswerOptionService {
  private apiUrl = 'http://your-api-endpoint/api/answerOption'; // Update with your API endpoint

  constructor(private http: HttpClient) {}

  getAnswerOptions(): Observable<AnswerOptionDTO[]> {
    return this.http.get<AnswerOptionDTO[]>(this.apiUrl);
  }

  getAnswerOption(id: number): Observable<AnswerOptionDTO> {
    return this.http.get<AnswerOptionDTO>(`${this.apiUrl}/${id}`);
  }

  createAnswerOption(answerOption: AnswerOptionDTO): Observable<AnswerOptionDTO> {
    return this.http.post<AnswerOptionDTO>(this.apiUrl, answerOption);
  }

  updateAnswerOption(id: number, answerOption: AnswerOptionDTO): Observable<AnswerOptionDTO> {
    return this.http.put<AnswerOptionDTO>(`${this.apiUrl}/${id}`, answerOption);
  }

  deleteAnswerOption(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
