import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { Notification } from '../models/notification.model';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { UnreadMessageService } from '../services/unread-message.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  userRole!: string;
  userId!: number;
  @Output() newNotification = new EventEmitter<void>();
  @Output() unreadCountChange = new EventEmitter<number>();
  @ViewChild('audio', { static: false }) audio!: ElementRef<HTMLAudioElement>;

  private pollingInterval = 300; // Polling interval in milliseconds (e.g., 30 seconds)
  private pollingSubscription!: Subscription;

  constructor(
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getLoggedInUserRole() as 'Admin' | 'Instructor' | 'Student';
    const userId = this.authService.getLoggedInUserId();

    if (this.userRole === 'Admin' || this.userRole === 'Instructor' || this.userRole === 'Student') {
      this.fetchNotifications(); // Initial fetch

      // Start polling
      this.pollingSubscription = interval(this.pollingInterval).subscribe(() => {
        this.fetchNotifications();
      });

      this.webSocketService.getNotifications(this.userRole, userId).subscribe((notification) => {
        // Add new notification to the beginning of the array
        this.notifications.unshift({ ...notification, createdAt: new Date(notification.createdAt) });
        this.playNotificationSound();
        if (!notification.read) {
          this.newNotification.emit(); // Emit event only if notification is unread
        }
        this.updateUnreadCount();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe(); // Clean up polling on component destruction
    }
  }

  fetchNotifications(): void {
    const userId = this.authService.getLoggedInUserId();
    this.webSocketService.fetchNotifications(this.userRole, userId).subscribe(
      (notifications) => {
        console.log(notifications);
        this.notifications = notifications
          .filter(notification => !notification.deleted)
          .map(notification => ({ ...notification, createdAt: new Date(notification.createdAt) }))
          .reverse(); // Reverse the array to display newest first
        this.updateUnreadCount();
      },
      (error) => {
        console.error('Failed to fetch notifications:', error);
      }
    );
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
    if (this.userRole === 'Admin') {
      this.router.navigate(['/admin/course'], { queryParams: { tab: 'courseList' } });
    } else if (this.userRole === 'Instructor') {
      if (notification.message.includes('Student')) {
        // If the message includes "student", navigate to InstructorStudentComponent
        this.router.navigate(['/instructor/student']);
      } else if (notification.message.includes('enrollment')) {
        // Handle enrollment notifications if necessary
      } else {
        this.router.navigate(['/instructor/course'], { queryParams: { tab: 'courseList' } });
      }
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

  highlightMessage(notification: Notification): string {
    let message = notification.message;
    message = message.replace(/Accept/g, '<span class="text-green-600">Accept</span>');
    message = message.replace(/Reject/g, '<span class="text-red-600">Reject</span>');
    return message;
  }

  updateUnreadCount(): void {
    const unreadCount = this.notifications.filter(notification => !notification.read).length;
    this.unreadCountChange.emit(unreadCount);
  }
}
