// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Client, Message, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ChatMessage } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private messageSubject: BehaviorSubject<ChatMessage | null> = new BehaviorSubject<ChatMessage | null>(null);
  private notificationSubject: Subject<string> = new Subject<string>();

  constructor() {
    this.client = new Client();
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(new Date(), str);
      }
    });

    this.client.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      this.client.subscribe('/topic/public', (message: Message) => {
        this.handleMessage(message);
      });
      this.client.subscribe('/topic/notifications', (message: Message) => {
        this.handleNotification(message);
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  private handleMessage(message: Message): void {
    try {
      const jsonMessage = JSON.parse(message.body);
      this.messageSubject.next(jsonMessage);
    } catch (e) {
      console.error('Error parsing JSON message:', e);
      console.log('Non-JSON message received:', message.body);
    }
  }

  private handleNotification(message: Message): void {
    try {
      const jsonMessage = JSON.parse(message.body);
      this.notificationSubject.next(jsonMessage.message);
    } catch (e) {
      console.error('Error parsing JSON notification:', e);
      console.log('Non-JSON notification received:', message.body);
    }
  }

  public sendMessage(chatMessage: ChatMessage): void {
    if (this.client && this.client.connected) {
      const jsonMessage = JSON.stringify(chatMessage);
      this.client.publish({ destination: '/app/chat.sendMessage', body: jsonMessage });
    } else {
      console.error('Client is not connected');
    }
  }

  public sendNotification(message: string): void {
    if (this.client && this.client.connected) {
      this.client.publish({ destination: '/app/notify', body: JSON.stringify({ message }) });
    } else {
      console.error('Client is not connected');
    }
  }

  public getMessages(): Observable<ChatMessage | null> {
    return this.messageSubject.asObservable();
  }

  public getNotifications(): Observable<string> {
    return this.notificationSubject.asObservable();
  }
}
