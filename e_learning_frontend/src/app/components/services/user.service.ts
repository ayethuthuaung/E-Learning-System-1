import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseURL = 'http://localhost:8080/api/user';

  constructor(private httpClient: HttpClient) { }

  uploadUserData(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient.post(`${this.baseURL}/upload-user-data`, formData, {
      headers: new HttpHeaders({
        'enctype': 'multipart/form-data'
      })
    });
  }

  updateProfile(file: File, userId: number) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());
    console.log(file, userId.toString());
    
    return this.httpClient.post(`${this.baseURL}/updateProfile`, formData);
  }
  getUserConversations(userId: number): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseURL}/showData`);
}
 
}
