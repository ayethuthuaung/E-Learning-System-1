import { Component, Output, EventEmitter } from '@angular/core';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  showNewPassword: boolean = false; // Flag to toggle visibility
  showConfirmPassword: boolean = false; // Flag to toggle visibility

  @Output() close = new EventEmitter<void>();

  constructor(private userService: UserService) {}

  closeModal(): void {
    this.close.emit();
  }

  onInputChange(): void {
    this.errorMessage = ''; // Clear error message on input change
  }

  togglePasswordVisibility(type: 'new' | 'confirm'): void {
    if (type === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (type === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  submitChangePassword(): void {
    if (this.newPassword === ''|| this.confirmPassword === '') {
      this.errorMessage = 'Password cannot be empty.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      const loggedUser = JSON.parse(storedUser);
      const staffId = loggedUser.staffId;

      this.userService.changePasswordByStaffId(this.newPassword, staffId).subscribe(
        (response: any) => {
          if (response.message === 'New password cannot be the same as the old password.') {
            this.errorMessage = response.message;
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Password is changed successfully!',
              confirmButtonText: 'OK'
            }).then(() => {
              this.closeModal();
            });
          }
        },
        error => {
          console.error('Error changing password:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to change password.',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }
}
