import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface Conversation {
  id: number;
  name: string;
  chatRoomId: number;
}

@Component({
  selector: 'app-instructor-navbar',
  templateUrl: './instructor-navbar.component.html',
  styleUrls: ['./instructor-navbar.component.css']
})
export class InstructorNavbarComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  dropdownOpen = false;
  conversationList: Conversation[] = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchConversationList();
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
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
    this.router.navigate(['/chat', conversation.chatRoomId], {
      state: { userName: conversation.name }
    });
    this.dropdownOpen = false;
  }

  gohome():void{
    this.router.navigate(['home']);
  }
}
