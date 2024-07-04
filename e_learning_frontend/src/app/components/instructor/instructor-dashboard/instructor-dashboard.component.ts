import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface Conversation {
  id: number;
  name: string;
  chatRoomId: number;
  photo:any;
  
}

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit {
  isSidebarOpen = true;
  chatRoomVisible: boolean = false;
  chatRoom:boolean=false;
  conversationList: Conversation[] = [];
  selectedConversation: Conversation | null = null;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchConversationList();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleChatRoom(): void {
    this.chatRoomVisible = !this.chatRoomVisible;
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

  openChat(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.chatRoomVisible = true;
  }

  closeChat(): void {
    this.selectedConversation = null;
    this.chatRoomVisible = true;
  }
}
