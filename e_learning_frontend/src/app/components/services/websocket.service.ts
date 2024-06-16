import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:8081/chat');
  }

  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  onMessage(): void {
    this.socket.on('message', (data: string) => {
      console.log('Received: ', data);
    });
  }
}
