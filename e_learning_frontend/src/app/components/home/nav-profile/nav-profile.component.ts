import { Component, OnInit } from '@angular/core';
import { Role } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-profile',
  templateUrl: './nav-profile.component.html',
  styleUrls: ['./nav-profile.component.css']
})
export class NavProfileComponent implements OnInit{
  isDropdownOpen = false;
  photo:any= '';
  loggedUser: any = '';
  roles: Role[] = [];

  constructor(private router: Router) {} // Inject Router

  ngOnInit(): void {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      console.log(this.loggedUser);

      if (this.loggedUser) {
        this.photo = this.loggedUser.photo;
        this.roles = this.loggedUser.roles;

        // Access role IDs
        if (this.roles.length > 0) {
          this.roles.forEach(role => {
            console.log(role.id); // Print each role ID
          });
        }
         
      }
    }
  }
  hasRole(roleId: number): boolean {
    return this.roles.some(role => role.id === roleId);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    // Clear user data from localStorage
    localStorage.removeItem('loggedUser');
    // Redirect to login page or home page
    this.router.navigate(['/login']); // Adjust the route as needed
  }

  
}
