import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { Notification } from '../models/notification';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  userRole!: string;
  @ViewChild('audio', { static: false }) audio!: ElementRef<HTMLAudioElement>;

  constructor(private webSocketService: WebSocketService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getLoggedInUserRole();

    if (this.userRole === 'Admin') {
      this.webSocketService.fetchNotifications().subscribe(
        (notifications) => {
          this.notifications = notifications;
        },
        (error) => {
          console.error('Failed to fetch notifications:', error);
        }
      );

      this.webSocketService.getNotifications().subscribe((notification) => {
        this.notifications.push(notification);
        this.playNotificationSound();
      });
    }
  }

  playNotificationSound(): void {
    this.audio.nativeElement.play();
  }

  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.webSocketService.markAsRead(notification.id).subscribe(
        (updatedNotification) => {
          const index = this.notifications.findIndex(n => n.id === notification.id);
          if (index !== -1) {
            this.notifications[index] = updatedNotification;
          }
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
}
