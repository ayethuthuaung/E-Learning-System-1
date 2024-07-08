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

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
  
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  
  navigateToConversationList(): void {
    this.router.navigate(['/conservation-list']);
  }
  
}
