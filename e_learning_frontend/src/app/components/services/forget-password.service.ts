import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {
  private baseUrl = 'http://localhost:8080/user'; // Replace with your backend base URL

  constructor(private http: HttpClient) { }

  sendOTP(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/sendOTP`, null, {
      params: { email }
    });
  }

  matchOTP(otp: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/matchOTP`, null, {
      params: { otp }
    });
  }

  changePassword(newPassword: string, email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/changePassword`, null, {
      params: { newPassword, email }
    });
  }
}
