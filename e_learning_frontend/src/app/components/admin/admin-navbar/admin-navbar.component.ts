import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

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


  handleUnreadCountChange(count: number) {
    this.unreadCount = count;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
