// src/app/components/notification/notification.component.ts
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { Notification } from '../models/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
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
    });
  }

}
