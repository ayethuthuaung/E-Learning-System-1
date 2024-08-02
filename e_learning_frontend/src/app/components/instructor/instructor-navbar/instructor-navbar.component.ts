import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UnreadMessageService } from '../../services/unread-message.service';
import { WebSocketService } from '../../services/websocket.service';
import { Role } from '../../models/user.model';


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

  loggedUser: any = '';
  id: number = 0;
  name: any='';
  roles: Role[] = [];

  constructor( private router: Router,
    private authService: AuthService,
    private webSocketService: WebSocketService ) {}

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
            this.loadUnreadCount();
          });
        }
      }
    }
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
