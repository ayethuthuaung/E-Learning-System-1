import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor-sidebar',
  templateUrl: './instructor-sidebar.component.html',
  styleUrls: ['./instructor-sidebar.component.css']
})
export class InstructorSidebarComponent {
  @Input() isSidebarOpen: boolean = true;

  menuItems = [
    { label: 'Dashboard', link: 'instructor/dashboard', icon: 'fas fa-tachometer-alt', isActive: false },
    { label: 'Course', link: 'instructor/course', icon: 'fas fa-book', isActive: false },
    { label: 'Category', link: 'instructor/category', icon: 'fas fa-folder', isActive: false },
    { label: 'Students', link: '#', icon: 'fas fa-user-graduate', isActive: false },
    { label: 'Tests', link: '#', icon: 'fas fa-clipboard-list', isActive: false },
    { label: 'Meeting', link: '#', icon: 'fas fa-video', isActive: false },
    { label: 'Report', link: '#', icon: 'fas fa-file-alt', isActive: false },
    { label: 'Log out', link: '#', icon: 'fas fa-sign-out-alt', isActive: false },
  ];

  constructor(private router: Router) {}

  setActiveItem(item: any) {
    this.menuItems.forEach(menuItem => menuItem.isActive = false);
    item.isActive = true;
    this.router.navigate([item.link]);
  }
}
