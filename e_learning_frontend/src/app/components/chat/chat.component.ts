import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../services/websocket.service';
import { ChatMessage } from '../models/message';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() chatRoomId!: number;
  @Input() userName: string = '';
  @Output() close = new EventEmitter<void>();

  senderId!: number;
  messages: ChatMessage[] = [];
  newMessage!: string;
  messageSent: boolean = false;
  sessionId!: string;

  groupedMessages: { date: string, messages: ChatMessage[] }[] = [];

  constructor(
    private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
    console.log(this.sessionId);

    this.senderId = this.authService.getLoggedInUserId();
    console.log('Logged in user ID:', this.senderId);

    this.loadChatHistory();

    this.webSocketService.getMessages().subscribe((message: ChatMessage | null) => {
      if (message) {
        console.log("Received message:", message);
        message.message_side = message.senderId === this.senderId ? 'sender' : 'receiver';
        
        if (this.sessionId !== message.sessionId) {
          this.messages.push(message);
          this.messageSent = false;
        }
      }
    });
  }

  loadChatHistory(): void {
    this.webSocketService.getChatHistory(this.chatRoomId).subscribe(
      (history) => {
        this.messages = history.map(message => {
          message.message_side = message.senderId === this.senderId ? 'sender' : 'receiver';
          return message;
        });
      },
      (error) => {
        console.error('Error fetching chat history:', error);
      }
    );
  }

  sendMessage(): void {
    if (this.newMessage.trim() !== '') {
      const message: ChatMessage = {
        chatRoomId: this.chatRoomId,
        senderId: this.senderId,
        content: this.newMessage.trim(),
        message_side: 'sender',
        sessionId: this.sessionId,
      };

      this.messages.push(message);

      this.newMessage = '';
      this.messageSent = true;

      this.webSocketService.sendMessage(message);
    }
  }

  closeChat(): void {
    this.close.emit();
  }
  
}
