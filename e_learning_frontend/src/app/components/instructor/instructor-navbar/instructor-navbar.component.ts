import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { WebSocketService } from '../../services/websocket.service';


@Component({
  selector: 'app-instructor-navbar',
  templateUrl: './instructor-navbar.component.html',
  styleUrls: ['./instructor-navbar.component.css']
})
export class InstructorNavbarComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  dropdownOpen = false;
  unreadNotiCount: number = 0;
  showNotifications: boolean = false;

  constructor( private router: Router,
    private authService: AuthService,
    private webSocketService: WebSocketService ) {}

  ngOnInit(): void {
    this.loadUnreadCount();
  }
  loadUnreadCount(): void {
    const roleName = this.authService.getLoggedInUserRole();
    const userId = this.authService.getLoggedInUserId();

    if (roleName === 'Admin' || roleName === 'Instructor' || roleName === 'Student') {
      this.webSocketService.getUnreadNotiCount(roleName, userId).subscribe(
        (count) => {
          this.unreadNotiCount = count;
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

  navigateToConversationList(): void {
    this.router.navigate(['/conservation-list']);
  }


  gohome():void{
    this.router.navigate(['home']);
  }
  updateUnreadCount(count: number): void {
    this.unreadNotiCount = count;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
