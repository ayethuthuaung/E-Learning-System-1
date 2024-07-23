import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UnreadMessageService } from '../../services/unread-message.service';


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

  constructor( private router: Router, private unreadMessageService: UnreadMessageService) {}

  ngOnInit(): void {
    this.unreadMessageService.unreadNotiCount$.subscribe(count => {
      this.unreadNotiCount = count;
    });
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
