import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../models/student.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseURL = "http://localhost:8080/user";

  constructor(private httpClient: HttpClient) { }

  uploadUserData(uploadData: FormData) {
    return this.httpClient.post(`${this.baseURL}/upload-user-data`, uploadData);
  }

  getUserById(id: number): Observable<Student> {
    return this.httpClient.get<Student>(`${this.baseURL}/${id}`);
  }
}
