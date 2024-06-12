import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, catchError, throwError } from 'rxjs';


import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseURL = "http://localhost:8080/api/categories";

  constructor(private httpClient: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.baseURL);
  }

  
  getCategoryList(): Observable<Category[]>{
    return this.httpClient.get<Category[]>(`${this.baseURL}/categorylist`);
  }

  createCategory(category: Category): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}/addcategory`, category).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    return throwError('Something bad happened; please try again later.');
  }
  

  getCategoryById(id: number): Observable<Category>{
    return this.httpClient.get<Category>(`${this.baseURL}/getbyid/${id}`);
  }

  updateCategory(id: number, category: Category): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/updatecategory/${id}`, category);
  }

  deleteCategory(id: number): Observable<Object>{
    return this.httpClient.delete(`${this.baseURL}/deletecategory/${id}`);
  }
}