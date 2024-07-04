import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, catchError, map, of, tap } from "rxjs";
import { AuthDto, AuthResponse } from "../models/auth.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:8080/auth/login';  // URL to login API
  private currentUser: User | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  login(authDto: AuthDto): Observable<User | null> {
    return this.http.post<AuthResponse>(this.authUrl, authDto).pipe(
      tap(response => {
        if (response.currentUser) {
          this.currentUser = response.currentUser;
          // Store the currentUser in localStorage or sessionStorage if needed
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
      }),
      map(response => response.currentUser),
      catchError(this.handleError<User | null>('login', null))
    );
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}