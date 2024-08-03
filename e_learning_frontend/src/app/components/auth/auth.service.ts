import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginModel } from './login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  login(loginObj: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginObj);
  }

  logout(): void {
    localStorage.removeItem('loggedUser'); 
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('loggedUser');
  }
  // get user id for chat
  getLoggedInUserId(): number {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser')!);
    return loggedUser ? loggedUser.id : null;
  }
  //get user role for noti
  getLoggedInUserRole(): string {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser')!);
    return loggedUser ? loggedUser.roles[0].name : null; // Adjust based on how roles are stored
  }
  getUserId(): number {
    return Number(localStorage.getItem('userId'));
  }
}
