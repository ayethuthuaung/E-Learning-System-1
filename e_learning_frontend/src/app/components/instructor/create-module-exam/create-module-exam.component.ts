import { CourseService } from './../../services/course.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TabService } from '../../services/tab.service'; // Adjust the import path as necessary
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-create-module-exam',
  templateUrl: './create-module-exam.component.html',
  styleUrl: './create-module-exam.component.css',
})
export class CreateModuleExamComponent implements OnInit {
  lessonId: any;
  isSidebarOpen = true;
  activeTab: string = 'createModule';
  courseId: number = 0;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private courseService: CourseService,
    private tabService: TabService // Inject the TabService
  ) {}

  ngOnInit(): void {
    const lessonIdParam = this.route.snapshot.paramMap.get('lessonId');
    if (lessonIdParam !== null) {
      this.lessonId = +lessonIdParam;
    }
    // Set the active tab from the service
    this.activeTab = localStorage.getItem('activeTab') || 'createModule';
    this.setActiveTab(this.activeTab);
    this.getCourseId(this.lessonId);

  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    localStorage.setItem('activeTab', tab); // Update localStorage with the active tab
    this.router.navigate([`${tab}/${this.lessonId}`], { relativeTo: this.route });
  }

  getCourseId(lessonId: number): void {
    this.courseService.getCourseIdByLessonId(lessonId).subscribe(
      courseId => {
        console.log('Course ID:', courseId);
        this.courseId= courseId;
      },
      error => {
        console.error('Error fetching course ID:', error);
      }
    );
  }
  

  

 

  goBack() {
    this.router.navigate([`instructor/lesson/${this.courseId}`]);
  }
}
