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
  barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'Bar Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1
    }]
  };

  lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'Line Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  };

  chartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor() {}

  ngOnInit(): void {}
}
