// src/app/models/message.ts

export class ChatMessage {
  chatRoomId: number;
  senderId: number;
  content: string;
  message_side?: 'sender' | 'receiver';
  sessionId?: string;
  id: number; // Ensure there's a unique id property
  showDropdown?: boolean; // Add the showDropdown property
  voiceMessageUrl?: string;

  constructor(chatRoomId: number, senderId: number, content: string,id:number) {
    this.chatRoomId = chatRoomId;
    this.senderId = senderId;
    this.content = content;
    this.id=id
    this.showDropdown = false; // Initialize showDropdown to false
  }
}
