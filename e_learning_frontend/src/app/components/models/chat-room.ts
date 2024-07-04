// src/app/models/chat-room.ts

import { User } from "./user";

export interface ChatRoom {
    id: number;
    name: string;
    lastMessage:string;
    users:User[];
  }
  