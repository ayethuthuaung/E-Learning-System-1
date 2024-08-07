import { ExamDTO } from './../models/examdto.model';
import { ExamCreationDto } from './../models/examCreationDto.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exam } from '../models/exam.model';
import { StudentAnswer } from '../models/student-answer.model';
import { ExamList } from '../models/examList.model';

@Injectable({
    providedIn: 'root'
})
export class ExamService {
    private baseURL = "http://localhost:8080/api/exam";

    constructor(private httpClient: HttpClient) { }

    
    getExams(): Observable<ExamDTO[]> {
        return this.httpClient.get<ExamDTO[]>(`${this.baseURL}/viewList`);
    }
    getExamById(id: number): Observable<ExamDTO> {
        return this.httpClient.get<ExamDTO>(`${this.baseURL}/${id}`);
    }
    submitFormWithAnswers(examId: number, studentAnswers: StudentAnswer[]): Observable<any> {
        const formData = { examId, studentAnswers };
        return this.httpClient.post(`${this.baseURL}/submitForm`, formData);
      }

    createExam(examCreationDto: ExamCreationDto): Observable<Object> {
        return this.httpClient.post(`${this.baseURL}/add`, examCreationDto);
      }

    getExam(id: number): Observable<ExamDTO> {
        return this.httpClient.get<ExamDTO>(`${this.baseURL}/viewOne/${id}`);
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
    getExamWithQuestions(examId: number): Observable<ExamDTO> {
        return this.httpClient.get<ExamDTO>(`${this.baseURL}/examsWithQuestions/${examId}`);
      }

    getExamByLessonId(lessonId: number): Observable<ExamList[]> {
        return this.httpClient.get<ExamList[]>(`${this.baseURL}/byLesson/${lessonId}`);
    }

    getExamsByCourseId(courseId: number): Observable<ExamList[]> {
        return this.httpClient.get<ExamList[]>(`${this.baseURL}/exams/course/${courseId}`);
    }

    hasFinalExam(courseId: number): Observable<boolean> {
        return this.httpClient.get<boolean>(`${this.baseURL}/has-final-exam`, {
            params: { courseId: courseId.toString() }
        });
    }

}
