import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-instructor-sidebar',
  templateUrl: './instructor-sidebar.component.html',
  styleUrls: ['./instructor-sidebar.component.css']
})
export class InstructorSidebarComponent implements OnInit {
  @Input() isSidebarOpen: boolean = true;

  menuItems = [
    { label: 'Dashboard', link: '../../instructor/dashboard', icon: 'fas fa-tachometer-alt', isActive: false },
    { label: 'Course', link: '../../instructor/course', icon: 'fas fa-book', isActive: false },
    { label: 'Category', link: '../../instructor/category', icon: 'fas fa-folder', isActive: false },
    { label: 'Students', link: '../../instructor/student', icon: 'fas fa-user-graduate', isActive: false },
    { label: 'Message', link: '../../instructor/conservation-list', icon: 'fas fa-envelope', isActive: false },
    { label: 'Report', link: '#', icon: 'fas fa-file-alt', isActive: false },
    // { label: 'Log out', link: '#', icon: 'fas fa-sign-out-alt', isActive: false },
  ];

  constructor(public router: Router) {}

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
