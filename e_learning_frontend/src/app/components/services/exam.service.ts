import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exam } from '../models/exam.model';

@Injectable({
    providedIn: 'root'
})
export class ExamService {
    private baseURL = "http://localhost:8080/exam";

    constructor(private httpClient: HttpClient) { }

    getViewList(): Observable<Exam[]> {
        return this.httpClient.get<Exam[]>(`${this.baseURL}/viewList`);
    }

    createExam(exam: Exam): Observable<Object> {
        return this.httpClient.post(`${this.baseURL}/add`, exam);
    }

    getExam(id: number): Observable<Exam> {
        return this.httpClient.get<Exam>(`${this.baseURL}/viewOne/${id}`);
    }

    updateExam(id: number, exam: Exam): Observable<Object> {
        return this.httpClient.put(`${this.baseURL}/update/${id}`, exam);
    }

    deleteExam(id: number): Observable<Object> {
        return this.httpClient.delete(`${this.baseURL}/delete/${id}`);
    }

    getExamByQuestionType(questionTypeId: number): Observable<Exam[]> {
        return this.httpClient.get<Exam[]>(`${this.baseURL}/getExamByQuestionType/${questionTypeId}`);
    }

    addQuestionTypeToExam(examId: number, questionTypeId: number): Observable<Object> {
        return this.httpClient.post(`${this.baseURL}/addQuestionTypeToExam`, { examId, questionTypeId });
    }
}
