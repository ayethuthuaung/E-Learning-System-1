import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-instructor-sidebar',
  templateUrl: './instructor-sidebar.component.html',
  styleUrl: './instructor-sidebar.component.css'
})
export class InstructorSidebarComponent {
  @Input() isSidebarOpen: boolean = true;

}
