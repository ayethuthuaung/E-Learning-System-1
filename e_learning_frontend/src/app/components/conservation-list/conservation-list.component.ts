import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatMessage } from '../models/message';
import { WebSocketService } from '../services/websocket.service';

interface Conversation {
  id: number;
  name: string;
  chatRoomId: number;
  photoUrl: '';
}

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conservation-list.component.html',
  styleUrls: ['./conservation-list.component.css']
})
export class ConservationListComponent implements OnInit {
  conversationList: Conversation[] = [];
  selectedConversation?: Conversation;
  isSidebarOpen = true;
  showConversationList = false;

  senderId!: number;
  messages: ChatMessage[] = [];
  newMessage: string='';
  messageSent: boolean = false;
  sessionId!: string;
  chatRoomId!: number;

  constructor(private http: HttpClient, private authService: AuthService,private route: ActivatedRoute,
    private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.fetchConversationList();

    this.sessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
    console.log(this.sessionId);

    this.senderId = this.authService.getLoggedInUserId();
    console.log('Logged in user ID:', this.senderId);

    

    this.webSocketService.getMessages().subscribe((message: ChatMessage | null) => {
      if (message && message.chatRoomId === this.chatRoomId) {
        message.message_side = message.senderId === this.senderId ? 'sender' : 'receiver';
        this.messages.push(message);
      }
    });
    this.loadChatHistory();
  }
  loadChatHistory(): void {
    this.webSocketService.getChatHistory(this.chatRoomId).subscribe(
      (history:ChatMessage[]) => {
        this.messages = history.map(message => {
          message.message_side = message.senderId === this.senderId ? 'sender' : 'receiver';
          message.showDropdown = false; // Initialize showDropdown to false
          return message;
        });
      },
      (error) => {
        console.error('Error fetching chat history:', error);
      }
    );
  }
  sendMessage(): void {
    if (this.newMessage && this.newMessage.trim()) {
      const chatMessage: ChatMessage = {
        chatRoomId: this.chatRoomId,
        senderId: this.senderId,
        content: this.newMessage,
        message_side: 'sender',
        sessionId: this.sessionId,
        id: Date.now(),
        showDropdown: false,
        fileUrl: '',
        messageType: 'text'
      };

      this.webSocketService.sendMessage(chatMessage);
      this.newMessage = '';
    }
  }
  uploadFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.type.split('/')[0];
      this.webSocketService.uploadFile(file,fileType).subscribe(
        (fileUrl: string) => {
          console.log(fileUrl);
          
          this.webSocketService.sendFileMessage(fileUrl, this.chatRoomId, this.senderId, fileType, this.sessionId);
        },
        (error) => {
          console.error('File upload failed:', error);
        }
      );
    }
  }
  
  softDeleteMessage(messageId: number): void {
    this.webSocketService.softDeleteMessage(messageId).subscribe(
      () => {
        this.messages = this.messages.filter(message => message.id !== messageId);
      },
      (error) => {
        console.error('Error deleting message:', error);
      }
    );
  }



  fetchConversationList(): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId !== null) {
      this.http.get<Conversation[]>(`http://localhost:8080/api/chat/conversation-list/${userId}`).subscribe({
        next: (conversations) => this.conversationList = conversations,
        error: (error) => console.error('Error fetching conversation list:', error)
      });
    }
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.chatRoomId=conversation.chatRoomId;
    this.loadChatHistory();
  }
  
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  handleShowConversationList(): void {
    this.showConversationList = true;
  }

}
