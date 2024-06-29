import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conservation-list.component.html',
  styleUrls: ['./conservation-list.component.css']
})
export class ConservationListComponent implements OnInit {
  conversationList: User[] = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchConversationList();
  }

  fetchConversationList(): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId !== null) {
      this.http.get<User[]>(`http://localhost:8080/chat/conversation-list/${userId}`).subscribe({
        next: (conversations) => this.conversationList = conversations,
        error: (error) => console.error('Error fetching conversation list:', error)
      });
    }
  }

  openChat(user: User): void {
    this.router.navigate(['/chat', user.id, user.name]);
  }
}
