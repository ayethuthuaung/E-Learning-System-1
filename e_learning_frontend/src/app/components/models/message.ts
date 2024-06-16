export class Message {
    chatRoomId: number;
    senderId: number;
    content: string;
  
    constructor(chatRoomId: number, senderId: number, content: string) {
      this.chatRoomId = chatRoomId;
      this.senderId = senderId;
      this.content = content;
    }
  }