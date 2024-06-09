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

  login(loginModel: LoginModel): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/login`, loginModel, { headers, responseType: 'text' as 'json' });
  }

  logout(): void {
    localStorage.removeItem('loggedUser');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('loggedUser');
  }
}
