// src/app/models/message.ts

export class ChatMessage {
  chatRoomId: number;
  senderId: number;
  content: String;
  message_side?: 'sender' | 'receiver';
  sessionId?: string;
  id: number; 
  showDropdown?: boolean; 
  fileUrl?: string; 
  messageType?: string; 
  file?: File;
  editMode?: boolean;
  

  constructor(chatRoomId: number, senderId: number, content: String,id:number,file?:File) {
    this.chatRoomId = chatRoomId;
    this.senderId = senderId;
    this.content = content;
    this.id=id
    this.showDropdown = false; 
    this.file=file// Initialize showDropdown to false
  }
  
}
