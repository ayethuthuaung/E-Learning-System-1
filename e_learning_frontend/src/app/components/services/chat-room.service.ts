import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {
  private baseUrl = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient) {}

  create(instructorId: number, studentId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create?instructorId=${instructorId}&studentId=${studentId}`, {});
  }
}
