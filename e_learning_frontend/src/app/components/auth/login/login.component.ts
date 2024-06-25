import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginObj: LoginModel = new LoginModel();
  isSignDivVisiable: boolean = false;
  showPassword: boolean = false; // Added property

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.loginObj).subscribe(
      response => {
        console.log('Response:', response);
        alert('Login Success');
        localStorage.setItem('loggedUser', JSON.stringify(response));
        this.router.navigateByUrl('/home');
      },
      error => {
        console.error('Error:', error);
        alert('Login Failed');
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
    this.staffId = "";
    this.password = "";
  }
}

export class SignUpModel {
  name: string;
  staffId: string;
  password: string;

  constructor() {
    this.staffId = "";
    this.name = "";
    this.password = "";
  }
}
