import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/chat';
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:8081/chat-socket');
  }

  sendMessage(message: Message) {
    this.socket.emit('sendMessage', message);
  }

  getMessages(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  getChatHistory(chatRoomId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/history/${chatRoomId}`);
  }

  createChatRoom(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-room`, { name });
  }
}
