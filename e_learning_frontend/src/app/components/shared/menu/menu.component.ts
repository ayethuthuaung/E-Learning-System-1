import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Role } from '../../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { WebSocketService } from '../../services/websocket.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  loggedUser: any = '';
  id: number = 0;
  roles: Role[] = [];
  unreadCount: number = 0;
  showNotifications = false;

  constructor(private userService: UserService,private webSocketService: WebSocketService,private authService: AuthService) {}

  ngOnInit(): void {
    
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      console.log(this.loggedUser);

      if (this.loggedUser) {
        this.id = this.loggedUser.id;
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
          this.unreadCount = count;
        },
        (error) => {
          console.error('Failed to fetch unread count:', error);
        }
      );
    }
  }
  UnreadNotiCount(count: number): void {
    this.unreadCount = count;
  }
  hasRole(roleId: number): boolean {
    return this.roles.some(role => role.id === roleId);
  }
  
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  scrollToFooter(): void {
    const footerElement = document.querySelector('footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
