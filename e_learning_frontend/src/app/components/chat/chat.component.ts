import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../services/websocket.service';
import { ChatMessage } from '../models/message';
import { AuthService } from '../auth/auth.service';
import { ChatRoom } from '../models/chat-room';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  senderId!: number;
  messages: ChatMessage[] = [];
  newMessage!: string;
  messageSent: boolean = false;
  sessionId!: string;
  chatRoomId!: number;

  constructor(private route: ActivatedRoute, private webSocketService: WebSocketService,private authService: AuthService) {    
    
  }

  ngOnInit(): void {
    this.sessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
    console.log(this.sessionId);
    
    // Set senderId from AuthService
    this.senderId = this.authService.getLoggedInUserId();
    console.log('Logged in user ID:', this.senderId);

    this.chatRoomId = +this.route.snapshot.paramMap.get('chatRoomId')!;

    this.loadChatHistory();

    this.webSocketService.getMessages().subscribe((message: ChatMessage | null) => {
      if (message) {
        console.log("Received message:", message);
        message.message_side = message.senderId === this.senderId ? 'sender' : 'receiver';

        // Only add received messages to messages array if not sent by current user
        if (this.sessionId!==message.sessionId) {
          console.log(this.sessionId);
          console.log(message.sessionId);
          
    this.messages.push(message);
    this.messageSent = false; // Reset the flag after displaying the confirmed message
  }
      }
    });
  }
  loadChatHistory(): void {
    this.webSocketService.loadChatHistory(this.chatRoomId).subscribe({
      next: (history) => this.messages = history,
      error: (error) => console.error('Error loading chat history:', error)
    });
  }

  sendMessage(): void {

    console.log(this.sessionId);
    
    if (this.newMessage.trim() !== '') {
      const message: ChatMessage = {
        senderId: this.senderId,
        content: this.newMessage.trim(),
        message_side: 'sender',
        chatRoomId: 1 ,// Add other necessary properties
        sessionId: this.sessionId
      };

      // Immediately add the sent message to messages array for display
      this.messages.push(message);
      console.log("Sent message:", message);

      // Clear the input field
      this.newMessage = '';
      this.messageSent = true;
      // Send the message through WebSocket service
      this.webSocketService.sendMessage(message);
    
  }
  }
}