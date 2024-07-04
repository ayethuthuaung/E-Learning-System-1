import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ForgetPasswordService } from '../../services/forget-password.service';

declare var Swal: any;

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  resetEmail: string = '';
  otp: string[] = ['', '', '', '', '', ''];
  newPassword: string = '';
  confirmPassword: string = '';
  otpSent: boolean = false;
  otpMatched: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private forgetPasswordService: ForgetPasswordService, private router: Router) { }

  sendOTP() {
    this.forgetPasswordService.sendOTP(this.resetEmail).subscribe(
      response => {
        if (response.message.includes('Invalid email')) {
          this.errorMessage = response.message;
          this.successMessage = '';
        } else {
          console.log('OTP sent successfully', response);
          this.otpSent = true;
          this.errorMessage = '';
          this.successMessage = 'OTP sent successfully. Please check your email.';
        }
      },
      error => {
        console.error('Error sending OTP', error);
        this.errorMessage = 'Error sending OTP. Please try again.';
        this.successMessage = '';
      }
    );
  }

  matchOTP() {
    const otpValue = this.otp.join('');
    this.forgetPasswordService.matchOTP(otpValue).subscribe(
      response => {
        if (response.message.includes('Incorrect OTP')) {
          this.errorMessage = 'Incorrect OTP. Please try again.';
          this.successMessage = '';
        } else {
          console.log('OTP matched successfully', response);
          this.otpMatched = true;
          this.errorMessage = '';
          this.successMessage = '';
        }
      },
      error => {
        console.error('Error matching OTP', error);
        this.errorMessage = 'Error matching OTP. Please try again.';
        this.successMessage = '';
      }
    );
  }

  changePassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please enter both new password and confirm password.';
      this.successMessage = '';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "New password and confirm password don't match.";
      this.successMessage = '';
      return;
    }
    this.forgetPasswordService.changePassword(this.newPassword, this.resetEmail).subscribe(
      response => {
        if (response.message === "New password cannot be old password.") {
          this.errorMessage = "Old password and new password can't be same.";
          this.successMessage = '';
        } else if (response.message === "Password is updated.") {
          this.errorMessage = '';
          this.successMessage = "Password is changed successfully.";
          this.showSuccessAlert();
        } else {
          this.errorMessage = response.message;
          this.successMessage = '';
        }
      },
      error => {
        console.error('Error changing password', error);
        this.errorMessage = 'Error changing password. Please try again.';
        this.successMessage = '';
      }
    );
    
  }

  focusNext(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    if (target.value.length === 1 && index < this.otp.length - 1) {
      const nextInput = document.querySelectorAll('.otp-input')[index + 1] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  togglePasswordVisibility(field: 'newPassword' | 'confirmPassword') {
    if (field === 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  showSuccessAlert(): void {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Password is changed successfully.',
      confirmButtonText: 'OK'
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']); // Navigate to the login page
      }
    });
  }
}
