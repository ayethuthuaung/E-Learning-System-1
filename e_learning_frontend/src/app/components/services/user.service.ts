import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseURL = "http://localhost:8080/user";

  constructor(private httpClient: HttpClient) { }

  uploadUserData(uploadData: FormData) {
    return this.httpClient.post(`${this.baseURL}/upload-user-data`, uploadData);
  }
  getUserConversations(userId: number): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseURL}/showData`);
}
 
}
