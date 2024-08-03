import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';


import { Student } from '../models/student.model';
import { UserCourse } from '../models/usercourse.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  updateUserCourse(userCourseId: number, completed: boolean, progress: number) {
    throw new Error('Method not implemented.');
  }
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

  sendOTP(email: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/sendOTP`, { email });
  }

  matchOTP(otp: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/matchOTP`, { otp });
  }

  changePassword(newPassword: string, email: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/changePassword`, { newPassword, email });
  }

  changePasswordByStaffId(newPassword: string, staffId: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/changePasswordByStaffId`, null, {
      params: {
        newPassword,
        staffId
      }
    });
  }
  

  getUserList(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(`${this.baseURL}/userList`);
  }
  getUserLists(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseURL}/userList`);
  }

  getUserById(id: number): Observable<Student> {
    return this.httpClient.get<Student>(`${this.baseURL}/${id}`);
  }

  getUsersById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseURL}/${id}`);
  }

  updateProfile(file: File, userId: number) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());

    return this.httpClient.post(`${this.baseURL}/updateProfile`, formData);
  }

  getUserConversations(userId: number): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseURL}/showData`);
}

checkExamOwner(examId: number, userId: number): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.baseURL}/checkExamOwner`, {
    params: { examId: examId.toString(), userId: userId.toString() }
  });
}
getInstructorCount(): Observable<{ instructorCount: number }> {
  return this.httpClient.get<{ instructorCount: number }>(`${this.baseURL}/instructor-count`);
}

}

