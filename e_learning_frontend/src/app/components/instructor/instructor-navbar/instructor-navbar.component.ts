import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-instructor-navbar',
  templateUrl: './instructor-navbar.component.html',
  styleUrls: ['./instructor-navbar.component.css']
})
export class InstructorNavbarComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  dropdownOpen = false;
  unreadCount: number = 0;
  showNotifications: boolean = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  navigateToConversationList(): void {
    this.router.navigate(['/conservation-list']);
  }


  gohome():void{
    this.router.navigate(['home']);
  }
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.unreadCount = 0; // Reset unread count when opening notifications
    }
  }

  handleNewNotification(): void {
    if (!this.showNotifications) {
      this.unreadCount += 1; // Increment unread count only if notifications panel is not open
    }
  }
}
