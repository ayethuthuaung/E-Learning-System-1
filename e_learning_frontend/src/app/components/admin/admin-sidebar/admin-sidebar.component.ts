import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  @Input() isSidebarOpen: boolean = true;

  menuItems = [
    { label: 'Dashboard', link: 'admin/dashboard', icon: 'fas fa-tachometer-alt', isActive: false },
    { label: 'Excel Upload', link: 'admin/upload-user-data', icon: 'fas fa-book', isActive: false },
    { label: 'Course', link: 'admin/course', icon: 'fas fa-book', isActive: false },
    { label: 'Category', link: 'admin/category', icon: 'fas fa-folder', isActive: false },
    { label: 'Students', link: '#', icon: 'fas fa-user-graduate', isActive: false },
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
