import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Module } from '../models/module.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseModuleService {

  private baseUrl = 'http://localhost:8080/api/modules';

  constructor(private http: HttpClient) {}  
  
  getModuleById(moduleId: number): Observable<Module> {
    return this.http.get<Module>(`${this.baseUrl}/${moduleId}`);
  }
}
