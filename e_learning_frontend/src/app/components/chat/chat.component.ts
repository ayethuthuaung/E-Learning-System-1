import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../services/websocket.service';
import { AuthService } from '../auth/auth.service';
import { ChatMessage } from '../models/message';
import { HttpClient } from '@angular/common/http';

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

  // Variables for voice recording
  isRecording: boolean = false;
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];

  constructor(
    private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private http: HttpClient // Inject HttpClient for API calls
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
    if (this.newMessage.trim() !== '') {
      const message: ChatMessage = {
        chatRoomId: this.chatRoomId,
        senderId: this.senderId,
        content: this.newMessage.trim(),
        message_side: 'sender',
        sessionId: this.sessionId,
        id: Date.now(), // Generate a unique id for each message
        showDropdown: false // Initialize showDropdown to false
      };

      this.messages.push(message);

      this.newMessage = '';
      this.messageSent = true;

      this.webSocketService.sendMessage(message);
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

  onRightClick(event: MouseEvent, message: ChatMessage): void {
    event.preventDefault(); // Prevent the default context menu from appearing
    this.messages.forEach(msg => msg.showDropdown = false); // Hide dropdown for all messages
    message.showDropdown = true; // Show dropdown for the right-clicked message
  }

  hideDropdown(): void {
    this.messages.forEach(msg => msg.showDropdown = false);
  }

  closeChat(): void {
    this.close.emit();
  }

  // Voice message functions
  startRecording(): void {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.isRecording = true;
        this.audioChunks = [];

        this.mediaRecorder.addEventListener('dataavailable', event => {
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('voiceMessage', audioBlob, 'voiceMessage.webm');
          this.uploadVoiceMessage(formData);
        });
      });
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  uploadVoiceMessage(formData: FormData): void {
    this.http.post<any>('http://localhost:8080/api/chat/uploadVoiceMessage', formData)
      .subscribe(response => {
        const voiceMessageUrl = response; // Adjust this based on your server response structure
  
        const message: ChatMessage = {
          chatRoomId: this.chatRoomId,
          senderId: this.senderId,
          content: 'Voice message',
          message_side: 'sender',
          sessionId: this.sessionId,
          id: Date.now(),
          showDropdown: false,
          voiceMessageUrl: voiceMessageUrl // Add the voice message URL to the message
        };

        this.messages.push(message);
        this.webSocketService.sendMessage(message);
      }, error => {
        console.error('Error uploading voice message:', error);
      });
  }
}
