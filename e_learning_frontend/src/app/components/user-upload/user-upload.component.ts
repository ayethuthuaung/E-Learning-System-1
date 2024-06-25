import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-upload',
  templateUrl: './user-upload.component.html',
  styleUrls: ['./user-upload.component.css']
})
export class UserUploadComponent {
  selectedFile: File | null = null;
  successmessage: string = '';
  errormessage: string = '';

  constructor(private userService: UserService) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    if (file && allowedTypes.includes(file.type)) {
      this.selectedFile = file;
      this.errormessage = ''; // Clear any previous error message
    } else {
      this.selectedFile = null;
      this.errormessage = 'Please select a valid Excel file (.xlsx)';
    }
  }

  onUpload(): void {
    this.successmessage = '';
    this.errormessage = '';

    if (this.selectedFile) {
      this.userService.uploadUserData(this.selectedFile).subscribe(
        response => {
          this.successmessage = 'File uploaded successfully';
          this.errormessage = ''; // Clear error message
        },
        error => {
          this.errormessage = 'File upload failed';
          this.successmessage = ''; // Clear success message
        }
      );
    } else {
      this.errormessage = 'Please select a file first';
      this.successmessage = ''; // Clear success message
    }
  }
}
