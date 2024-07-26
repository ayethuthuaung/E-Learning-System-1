import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { UnreadMessageService } from '../../services/unread-message.service';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})

export class AdminNavbarComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  dropdownOpen = false;
  unreadCount: number = 0;
  showNotifications: boolean = false;
  constructor(
    private http: HttpClient, 
    private router: Router, 
    private authService: AuthService,
    private webSocketService: WebSocketService
  ){}
  ngOnInit(): void {
    this.loadUnreadCount();
  }
  loadUnreadCount(): void {
    const roleName = this.authService.getLoggedInUserRole();
    const userId = this.authService.getLoggedInUserId();

    if (roleName === 'Admin' || roleName === 'Instructor' || roleName === 'Student') {
      this.webSocketService.getUnreadNotiCount(roleName, userId).subscribe(
        (count) => {
          this.unreadCount = count;
        },
        (error) => {
          console.error('Failed to fetch unread count:', error);
        }
      );
    }
  }
  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }


  gohome():void{
    this.router.navigate(['home']);
  }


  handleUnreadCountChange(count: number) {
    this.unreadCount = count;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
