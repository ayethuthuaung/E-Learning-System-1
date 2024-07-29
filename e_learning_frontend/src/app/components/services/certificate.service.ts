import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certificate } from '../models/certificate.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private baseURL = "http://localhost:8080/api/certificate";
  constructor(private http: HttpClient) { }

  getCertificateById(id: number): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.baseURL}/${id}`);
  }
  saveCertificate(certificate: Certificate): Observable<Certificate> {
    return this.http.post<Certificate>(this.baseURL, certificate);
  }
  getCertificateByUserId(id: number): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.baseURL}/user/${id}`);
  }

  getCertificateByUserIdAndCourseId(userId: number, courseId: number): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.baseURL}/user/${userId}/course/${courseId}`);
  }

  checkUserCertificate(userId: number, courseId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseURL}/checkUserCertificate`, {
      params: { userId: userId.toString(),courseId: courseId.toString() }
    });
  }
}
