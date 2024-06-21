// src/app/components/notification/notification.component.ts
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: string[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.getNotifications().subscribe((message) => {
      this.notifications.push(message);
    });
  }

  sendNotification(message: string): void {
    this.webSocketService.sendNotification(message);
  }
}
