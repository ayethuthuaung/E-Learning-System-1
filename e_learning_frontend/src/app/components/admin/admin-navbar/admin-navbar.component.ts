import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  unreadCount: number = 0;
  showNotifications: boolean = false;

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (!this.showNotifications) {
      this.unreadCount = 0; // Reset unreadCount when closing notifications
    }
  }

  // Method to update unreadCount based on notifications
  updateUnreadCount(count: number) {
    this.unreadCount = count;
  }

  // Method to handle incrementing unreadCount
  handleNewNotification() {
    if (!this.showNotifications) {
      this.unreadCount++; // Increment unreadCount only if notifications panel is closed
    }
  }
  
}
