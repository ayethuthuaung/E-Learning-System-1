import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { UnreadMessageService } from '../../services/unread-message.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit{
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  unreadCount: number = 0;
  showNotifications: boolean = false;
  constructor(private unreadMessageService: UnreadMessageService){}
  ngOnInit(): void {
    this.unreadMessageService.unreadMessageCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }
  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleUnreadCountChange(count: number) {
    this.unreadCount = count;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
