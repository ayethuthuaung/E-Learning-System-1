import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

declare var Swal: any; 

@Component({
  selector: 'app-user-upload',
  templateUrl: './user-upload.component.html',
  styleUrls: ['./user-upload.component.css']
})
export class UserUploadComponent {
  selectedFile: File | null = null;
  successmessage: string = '';
  errormessage: string = '';

  constructor(private userService: UserService, private router: Router) { }

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
          this.showSuccessAlert(); // Call the success alert and navigate to login
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

  showSuccessAlert(): void {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'File uploaded successfully.',
      confirmButtonText: 'OK'
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']); // Navigate to the login page
      }
    });
  }
  
}
