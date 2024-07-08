import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VideoUploadService {

    private uploadUrl = 'http://localhost:8080/api/file/uploadVideo';

    constructor(private http: HttpClient) { }

    uploadVideo(file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post(this.uploadUrl, formData, {
            headers: new HttpHeaders({
                'Accept': 'application/json'
            })
        });
    }
}
