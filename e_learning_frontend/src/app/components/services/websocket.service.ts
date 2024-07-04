// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Client, Message, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, Subject, catchError, throwError } from 'rxjs';
import { ChatMessage } from '../models/message';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private baseUrl = 'http://localhost:8080/api/notifications';
  private client: Client;
  private messageSubject: BehaviorSubject<ChatMessage | null> = new BehaviorSubject<ChatMessage | null>(null);
  private notificationSubject: Subject<Notification> = new Subject<Notification>();

  constructor(private http: HttpClient) {
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
      this.notificationSubject.next(jsonMessage);
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

  public getNotifications(): Observable<Notification> {
    return this.notificationSubject.asObservable();
  }
  public fetchNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>('http://localhost:8080/api/notifications')
      .pipe(
        catchError(this.handleError)
      );
  }
  markAsRead(id: number): Observable<Notification> {
    return this.http.post<Notification>(`${this.baseUrl}/${id}/read`, {});
  }
  getChatHistory(chatRoomId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`http://localhost:8080/api/chat/history/${chatRoomId}`).pipe(
      catchError(this.handleError)
    );
  }
  public softDeleteNotification(id: number): Observable<Notification> {
    return this.http.delete<Notification>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}

