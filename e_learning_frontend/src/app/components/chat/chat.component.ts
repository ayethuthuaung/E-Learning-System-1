import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { ChatMessage } from '../models/message';
import { AuthService } from '../auth/auth.service';
import { AudioRecorderService } from '../services/audio-recorder.service';
import { UnreadMessageService } from '../services/unread-message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked,OnChanges {
  @Input() chatRoomId!: number;
  @Input() userName: string = '';
  @Output() close = new EventEmitter<void>();
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  senderId!: number;
  messages: ChatMessage[] = [];
  newMessage!: string;
  messageSent: boolean = false;
  sessionId!: string;
  isRecording = false;
  unreadMessageCount: number = 0;
  private userScrolled = false;
  constructor(
    private webSocketService: WebSocketService,
    private authService: AuthService,private audioRecorderService:AudioRecorderService,private unreadMessageService:UnreadMessageService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId !== null) {
      this.senderId = userId;
    } else {
      console.error('Sender ID is null');
    }

    this.sessionId = `session-${Math.random().toString(36).substr(2, 9)}`;

    this.webSocketService.getMessages().subscribe((message: ChatMessage | null) => {
      if (message && message.chatRoomId === this.chatRoomId) {
        message.message_side = message.senderId === this.senderId ? 'sender' : 'receiver';
        if (message.senderId !== this.senderId && !message.read) {
          this.unreadMessageCount++;
          this.unreadMessageService.setUnreadMessageCount(this.unreadMessageCount);
        }
        this.messages.push(message);
        if (!this.userScrolled) {
          this.scrollToBottom();
        }
      }
    });

    if (this.chatRoomId) {
      this.fetchChatHistory();
    } else {
      console.error('chatRoomId is undefined in ngOnInit');
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatRoomId'] && !changes['chatRoomId'].firstChange) {
      if (this.chatRoomId) {
        this.fetchChatHistory();
      } else {
        console.error('chatRoomId is undefined in ngOnChanges');
      }
    }
  }
  ngAfterViewChecked(): void {
    if (!this.userScrolled) {
      this.scrollToBottom();
    }
  }
  fetchChatHistory(): void {
   
    this.webSocketService.getChatHistory(this.chatRoomId).subscribe(
      (history: ChatMessage[]) => {
        this.messages = history.map(message => {
          
          message.message_side = message.senderId === this.senderId ? 'sender' : 'receiver';
          if (message.senderId !== this.senderId && !message.read) {
            this.unreadMessageCount++;
            this.unreadMessageService.setUnreadMessageCount(this.unreadMessageCount);
          }
          message.showDropdown = false; // Initialize showDropdown to false
          return message;
        });
        this.scrollToBottom();
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
        messageType: 'text',
        read: false 
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
  

  editMessage(message: ChatMessage): void {
    message.editMode = true;
  }

  saveMessage(message: ChatMessage): void {
    const content = message.content.toString(); // Ensure content is a string

    this.webSocketService.updateMessage(message.id, content).subscribe(
      (updatedMessage: ChatMessage) => {
        const index = this.messages.findIndex(msg => msg.id === updatedMessage.id);
        if (index !== -1) {
          this.messages[index] = updatedMessage;
          this.messages[index].editMode = false;
        }
      },
      (error) => {
        console.error('Error updating message:', error);
      }
    );
  }

  cancelEdit(message: ChatMessage): void {
    message.editMode = false;
  }

  onScroll(): void {
    const element = this.chatContainer.nativeElement;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    this.userScrolled = !atBottom;
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
  startRecording(): void {
    this.isRecording = true;
    this.audioRecorderService.startRecording().catch(error => {
      console.error('Error starting recording:', error);
      this.isRecording = false;
    });
  }
  stopRecording(): void {
    this.audioRecorderService.stopRecording().then(audioBlob => {
      this.isRecording = false;

      const file = new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' });
      const fileType = 'voice';

      this.webSocketService.uploadFile(file, fileType).subscribe(
        (fileUrl: string) => {
          this.webSocketService.sendFileMessage(fileUrl, this.chatRoomId, this.senderId, fileType, this.sessionId);
        },
        (error) => {
          console.error('File upload failed:', error);
        }
      );
    }).catch(error => {
      console.error('Error stopping recording:', error);
    });
  }
  closeChat(): void {
    this.close.emit();
  }
}
