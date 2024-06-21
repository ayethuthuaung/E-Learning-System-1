// src/app/models/chat-message.model.ts

export class ChatMessage {
  chatRoomId: number;
  senderId: number;
  content: string;
  message_side?: string; 
  sessionId?:string;

  constructor(chatRoomId: number, senderId: number, content: string) {
    this.chatRoomId = chatRoomId;
    this.senderId = senderId;
    this.content = content;
  }
}