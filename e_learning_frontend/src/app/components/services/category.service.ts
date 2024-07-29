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
    return this.httpClient.get<Category[]>(`${this.baseURL}/categorylist`);
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
    return this.httpClient.get<Category>(`${this.baseURL}/${id}`);
  }

  updateCategory(id: number, category: Category): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/update/${id}`, category);
  }

  softDeleteCategory(id: number): Observable<Object>{
    return this.httpClient.delete(`${this.baseURL}/delete/${id}`);
  }
  isCategoryNameAlreadyExists(name: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseURL}/existsByName`, { params: { name } });
  }
  getCourseCountsPerCategory(): Observable<{ [category: string]: number }> {
    return this.httpClient.get<{ [category: string]: number }>(`${this.baseURL}/course-counts`);
  }
}