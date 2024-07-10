import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { Notification } from '../models/notification.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  userRole!: string;
  @Output() newNotification = new EventEmitter<void>();
  @ViewChild('audio', { static: false }) audio!: ElementRef<HTMLAudioElement>;

  constructor(private webSocketService: WebSocketService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getLoggedInUserRole();

    if (this.userRole === 'Admin') {
      this.webSocketService.fetchNotifications().subscribe(
        (notifications) => {
          console.log(notifications);
          this.notifications = notifications
            .filter(notification => !notification.deleted)
            .map(notification => ({ ...notification, createdAt: new Date(notification.createdAt) }))
            .reverse(); // Reverse the array to display newest first
        },
        (error) => {
          console.error('Failed to fetch notifications:', error);
        }
      );

      this.webSocketService.getNotifications().subscribe((notification) => {
        // Add new notification to the beginning of the array
        this.notifications.unshift({ ...notification, createdAt: new Date(notification.createdAt) });
        this.playNotificationSound();
        if (!notification.read) {
          this.newNotification.emit(); // Emit event only if notification is unread
        }
      });
    }
  }

  playNotificationSound(): void {
    this.audio.nativeElement.play();
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      this.webSocketService.markAsRead(notification.id).subscribe(
        () => {
          notification.read = true; // Update the local state
        },
        (error) => {
          console.error('Failed to mark notification as read:', error);
        }
      );
    }
  }

  softDeleteNotification(notification: Notification): void {
    this.webSocketService.softDeleteNotification(notification.id).subscribe(
      () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      },
      (error) => {
        console.error('Failed to delete notification:', error);
      }
    );
  }
  
  closeNotifications(): void {
    this.notifications = [];
  }
}
