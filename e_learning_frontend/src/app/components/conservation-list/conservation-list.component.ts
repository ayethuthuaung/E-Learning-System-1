import { Component } from '@angular/core';
import { ChatRoom } from '../models/chat-room';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conservation-list',
  templateUrl: './conservation-list.component.html',
  styleUrls: ['./conservation-list.component.css']
})
export class ConservationListComponent {
  conversationList: ChatRoom[] = [];

  constructor(private http: HttpClient, private router: Router,private authService:AuthService) {}

  ngOnInit(): void {
    this.fetchConversationList();
  }

  fetchConversationList(): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId !== null) {
      this.http.get<ChatRoom[]>(`http://localhost:8080/chat/conversation-list/${userId}`).subscribe({
        next: (conversations) => this.conversationList = conversations,
        error: (error) => console.error('Error fetching conversation list:', error)
      });
    }
  }


  openChat(chatRoomId: number): void {
    this.router.navigate(['/chat', chatRoomId]);
  }
}
