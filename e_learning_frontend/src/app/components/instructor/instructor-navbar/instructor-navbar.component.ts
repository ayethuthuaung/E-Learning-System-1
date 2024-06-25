import { Component, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-instructor-navbar',
  templateUrl: './instructor-navbar.component.html',
  styleUrl: './instructor-navbar.component.css'
})
export class InstructorNavbarComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

}
