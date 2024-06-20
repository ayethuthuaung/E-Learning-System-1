import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

 
  private baseURL = "http://localhost:8080/fileUpload";

  constructor(private httpClient: HttpClient) { }

  uploadToDrive(uploadData: FormData) {
    return this.httpClient.post(`${this.baseURL}/uploadToDrive`, uploadData);
  }
}
