// src/app/services/websocket.service.ts

import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/message';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client = new Client;
  private messageSubject: BehaviorSubject<ChatMessage | null> = new BehaviorSubject<ChatMessage | null>(null);

  constructor() {
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
        try {
          const jsonMessage = JSON.parse(message.body);
          this.messageSubject.next(jsonMessage);
        } catch (e) {
          console.error('Error parsing JSON message:', e);
          console.log('Non-JSON message received:', message.body);
          // Optionally handle non-JSON messages here
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  public sendMessage(chatMessage: ChatMessage): void {
    if (this.client && this.client.connected) {
      const jsonMessage = JSON.stringify(chatMessage);
      this.client.publish({ destination: '/app/chat.sendMessage', body: jsonMessage });
    } else {
      console.error('Client is not connected');
    }
  }

  public getMessages(): Observable<ChatMessage | null> {
    return this.messageSubject.asObservable();
  }
}