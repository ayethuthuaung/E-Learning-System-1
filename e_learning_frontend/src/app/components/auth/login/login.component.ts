import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginObj: LoginModel = new LoginModel();
  isSignDivVisiable: boolean = false;
  showPassword: boolean = false; // Added property
  successmessage: string = ''; // Added property for message
  errormessage: string ='';
  messageType: string = ''; // To differentiate between success and error
  staffIdError: string = '';
  passwordError: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onInputChange(): void {
    this.errormessage = ''; 
    this.successmessage = ''; 
    this.staffIdError = '';
    this.passwordError = '';
  }

  onLogin() {

    this.staffIdError = !this.loginObj.staffId ? 'Staff ID is required' : '';
    this.passwordError = !this.loginObj.password ? 'Password is required' : '';

    if (this.staffIdError || this.passwordError) {
      this.messageType = 'error';
      return;
    }

    this.authService.login(this.loginObj).subscribe(
      response => {
        if (response && response.currentUser) {
          const currentUser: User = response.currentUser;

          if (currentUser.roles && currentUser.roles.length > 0) {
            this.successmessage = 'Login Success';
            this.messageType = 'success';
            localStorage.setItem('loggedUser', JSON.stringify(currentUser));
            this.router.navigateByUrl('/home');
          } else {
            this.errormessage = 'Login Failed: User role is missing';
            this.messageType = 'error';
          }
        } else {
          this.errormessage = 'Login Failed: Invalid response structure';
          this.messageType = 'error';
        }
      },
      error => {
        this.errormessage = 'Login Failed';
        this.messageType = 'error';
      }
    );
  }



  // Added method
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

export class LoginModel {
  staffId: string;
  password: string;

  constructor() {
    this.staffId = '';
    this.password = '';
  }
}

export class SignUpModel {
  name: string;
  staffId: string;
  password: string;

  constructor() {
    this.staffId = '';
    this.name = '';
    this.password = '';
  }
}

