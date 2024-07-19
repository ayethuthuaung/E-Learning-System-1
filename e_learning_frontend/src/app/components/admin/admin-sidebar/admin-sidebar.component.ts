import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent implements OnInit {
  @Input() isSidebarOpen: boolean = true;

  menuItems = [
    { label: 'Dashboard', link: '../../admin/dashboard', icon: 'fas fa-tachometer-alt', isActive: false },
    { label: 'Excel Upload', link: '../../admin/upload-user-data', icon: 'fa-solid fa-file-import', isActive: false },
    { label: 'Course', link: '../../admin/course', icon: 'fas fa-book', isActive: false },
    { label: 'Category', link: '../../admin/category', icon: 'fas fa-folder', isActive: false },
    { label: 'Student', link: '../../admin/student', icon: 'fas fa-user-graduate', isActive: false },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveItemByRoute(this.router.url);
      }
    });
  }

  setActiveItemByRoute(url: string) {
    this.menuItems.forEach(item => {
      item.isActive = url.includes(item.link) || (item.label === 'Course' && url.includes('instructor/lesson'));
    });
  }
}
