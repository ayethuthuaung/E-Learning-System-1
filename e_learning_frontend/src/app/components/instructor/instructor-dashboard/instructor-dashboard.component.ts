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
  

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleChatRoom(): void {
    this.chatRoomVisible = !this.chatRoomVisible;
  }

  
}
