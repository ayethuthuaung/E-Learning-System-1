
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { ChatMessage } from '../models/message';
import { LoginComponent, LoginModel } from '../auth/login/login.component';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  senderId!:number;

  constructor(private webSocketService: WebSocketService) {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    this.senderId = loggedUser.staffId || 0; // Ensure this matches the actual property name
  }

  ngOnInit(): void {
    this.webSocketService.getMessages().subscribe((message: ChatMessage | null) => {
      if(message)  {
        this.messages.push(message);
      }
      
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const chatMessage = new ChatMessage(1, 1, this.newMessage.trim()); // Replace with actual chatRoomId and senderId
      this.webSocketService.sendMessage(chatMessage);
      this.newMessage = '';
    }
  }
  
}