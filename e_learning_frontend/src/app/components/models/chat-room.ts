// src/app/models/chat-room.ts

export class ChatRoom {
    id?: number;
    name: string;
  
    constructor(id: number, name: string) {
      this.id = id;
      this.name = name;
    }
  }
  