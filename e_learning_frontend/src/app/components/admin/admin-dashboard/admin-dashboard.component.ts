import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  showNotificationsPage: boolean = false;
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleNotificationsPage() {
    this.showNotificationsPage = !this.showNotificationsPage;
  }

  constructor() {}

  ngOnInit(): void {
    
  }
 
}
