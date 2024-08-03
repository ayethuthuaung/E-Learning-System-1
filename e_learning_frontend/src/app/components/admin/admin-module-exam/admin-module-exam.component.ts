import { CourseService } from './../../services/course.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TabService } from '../../services/tab.service';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-admin-module-exam',
  templateUrl: './admin-module-exam.component.html',
  styleUrl: './admin-module-exam.component.css'
})
export class AdminModuleExamComponent implements OnInit {
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
      this.lessonId = this.decodeId(lessonIdParam); 
    }
    // Set the active tab from the service
    this.activeTab = localStorage.getItem('activeTab') || 'createModule';
    this.setActiveTab(this.activeTab);
    this.getCourseId(this.lessonId);

  }
  decodeId(encodedId: string): number {
    try {
      // Extract the Base64 encoded ID part
      const parts = encodedId.split('-');
      if (parts.length !== 6) {
        throw new Error('Invalid encoded ID format');
      }
      const base64EncodedId = parts[5];
      // Decode the Base64 string
      const decodedString = Base64.decode(base64EncodedId);
      // Convert the decoded string to a number
      const decodedNumber = Number(decodedString);
      if (isNaN(decodedNumber)) {
        throw new Error('Decoded ID is not a valid number');
      }
      return decodedNumber;
    } catch (error) {
      console.error('Error decoding ID:', error);
      throw new Error('Invalid ID');
    }
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    localStorage.setItem('activeTab', tab); // Update localStorage with the active tab
    const encodedId = this.encodeId(this.lessonId.toString());
    this.router.navigate([`${tab}/${encodedId}`], { relativeTo: this.route });
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
    const encodedId = this.encodeId(this.courseId.toString());
    this.router.navigate([`admin/lesson/${encodedId}`]);
  }
  encodeId(id: string): string {
    const base64EncodedId = Base64.encode(id);
    const uuid = 'af782e56-8887-4130-9c0e-114ab93d7ebe'; // Static UUID-like string for format
    return `${uuid}-${base64EncodedId}`;
  }
}