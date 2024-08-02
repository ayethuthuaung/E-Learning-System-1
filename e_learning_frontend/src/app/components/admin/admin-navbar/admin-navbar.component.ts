import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { WebSocketService } from '../../services/websocket.service';

import { Role } from '../../models/user.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit, OnDestroy {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  dropdownOpen = false;
  unreadCount: number = 0;
  showNotifications: boolean = false;

  loggedUser: any = '';
  id: number = 0;
  name: any = '';
  roles: Role[] = [];

  private pollingInterval = 30000; // Polling interval in milliseconds (e.g., 30 seconds)
  private pollingSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private webSocketService: WebSocketService
  ) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      console.log(this.loggedUser);

      if (this.loggedUser) {
        this.id = this.loggedUser.id;
        this.name = this.loggedUser.name;
        this.roles = this.loggedUser.roles;

        // Access role IDs
        if (this.roles.length > 0) {
          this.roles.forEach(role => {
            console.log(role.id); // Print each role ID
            // this.loadUnreadCount();

          });
        }
      }
    }
    this.loadUnreadCount(); // Initial fetch
    // Start polling for unread count
    this.pollingSubscription = interval(this.pollingInterval).subscribe(() => {
      this.loadUnreadCount();
    });
  }



  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe(); // Clean up polling on component destruction
    }
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

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  gohome(): void {
    this.router.navigate(['home']);
  }

  handleUnreadCountChange(count: number): void {
    this.unreadCount = count;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
}
