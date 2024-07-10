// import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { WebSocketService } from '../services/websocket.service';
// import { AuthService } from '../auth/auth.service';
// import { ChatMessage } from '../models/message';

// @Component({
//   selector: 'app-chat',
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.css']
// })
// export class ChatComponent implements OnInit {
//   @Input() chatRoomId!: number;
//   @Input() userName: string = '';
//   @Output() close = new EventEmitter<void>();

//   senderId!: number;
//   messages: ChatMessage[] = [];
//   newMessage!: string;
//   messageSent: boolean = false;
//   sessionId!: string;

//   constructor(
//     private webSocketService: WebSocketService,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.sessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
//     console.log(this.sessionId);

//     this.senderId = this.authService.getLoggedInUserId();
//     console.log('Logged in user ID:', this.senderId);

//     this.loadChatHistory();

//     this.webSocketService.getMessages().subscribe((message: ChatMessage | null) => {
//       if (message) {
//         console.log("Received message:", message);
//         message.message_side = message.senderId === this.senderId ? 'sender' : 'receiver';
//         if (this.sessionId !== message.sessionId) {
//           this.messages.push(message);
//           this.messageSent = false;
//         }
//       }
//     });
//   }

//   loadChatHistory(): void {
//     this.webSocketService.getChatHistory(this.chatRoomId).subscribe(
//       (history) => {
//         this.messages = history.map(message => {
//           message.message_side = message.senderId === this.senderId ? 'sender' : 'receiver';
//           message.showDropdown = false; // Initialize showDropdown to false
//           return message;
//         });
//       },
//       (error) => {
//         console.error('Error fetching chat history:', error);
//       }
//     );
//   }

//   sendMessage(): void {
//     if (this.newMessage.trim() !== '') {
//       const message: ChatMessage = {
//         chatRoomId: this.chatRoomId,
//         senderId: this.senderId,
//         content: this.newMessage.trim(),
//         message_side: 'sender',
//         sessionId: this.sessionId,
//         id: Date.now(), // Generate a unique id for each message
//         showDropdown: false, // Initialize showDropdown to false
//         messageType: 'text' // Specify the message type
//       };

//       this.messages.push(message);
//       this.newMessage = '';
//       this.messageSent = true;
//       this.webSocketService.sendMessage(message);
//     }
//   }

//   handleFileInput(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       console.log(file);
      
//       const fileType = file.type.split('/')[0]; 
//       console.log(fileType);
//       // get the type like image, video, etc.
//       this.webSocketService.sendFileMessage(file, this.chatRoomId, this.senderId, fileType, this.sessionId);
//     }
//   }

//   softDeleteMessage(messageId: number): void {
//     this.webSocketService.softDeleteMessage(messageId).subscribe(
//       () => {
//         this.messages = this.messages.filter(message => message.id !== messageId);
//       },
//       (error) => {
//         console.error('Error deleting message:', error);
//       }
//     );
//   }

//   onRightClick(event: MouseEvent, message: ChatMessage): void {
//     event.preventDefault(); // Prevent the default context menu from appearing
//     this.messages.forEach(msg => msg.showDropdown = false); // Hide dropdown for all messages
//     message.showDropdown = true; // Show dropdown for the right-clicked message
//   }

//   hideDropdown(): void {
//     this.messages.forEach(msg => msg.showDropdown = false);
//   }

//   closeChat(): void {
//     this.close.emit();
//   }
// }
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { AuthService } from '../auth/auth.service';
import { ChatMessage } from '../models/message';

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

  constructor(
    private webSocketService: WebSocketService,
    private authService: AuthService
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
        this.messages.push(message);
      }
    });

    this.fetchChatHistory();
  }

  fetchChatHistory(): void {
    this.webSocketService.getChatHistory(this.chatRoomId).subscribe(
      (history: ChatMessage[]) => {
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
  closeChat(): void {
    this.close.emit();
  }
}
