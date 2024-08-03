import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { LessonService } from '../services/lesson.service';
import { Course } from '../models/course.model';
import { Module } from '../models/module.model';
import { Lesson } from '../models/lesson.model';
import { HttpErrorResponse } from '@angular/common/http';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-course-video-view',
  templateUrl: './course-video-view.component.html',
  styleUrls: ['./course-video-view.component.css']
})
export class CourseVideoViewComponent implements OnInit {
  lessons: Lesson[] = [];
  courseId: number | undefined;
  course: Course | undefined;
  moduleId: number | undefined;
  module: Module | undefined;
  
  loadingError = false;
  faArrowLeft = faArrowLeft;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const moduleIdParam = params.get('moduleId');
      const courseIdParam = params.get('courseId');

      if (moduleIdParam) {
        this.moduleId = +moduleIdParam;
        console.log(`Module ID: ${this.moduleId}`);
      } else {
        console.error('Module ID is not provided');
      }

      if (courseIdParam) {
        this.courseId = +courseIdParam;
        console.log(`Course ID: ${this.courseId}`);
      } else {
        console.error('Course ID is not provided');
      }

      if (this.courseId && this.courseId !== 0) {
        this.courseService.getCourseById(this.courseId).subscribe(
          (course: Course) => {
            this.course = course;
            console.log('Fetched Course:', this.course);
            this.fetchLessons(); // Fetch lessons after course is fetched
          },
          (error: HttpErrorResponse) => {
            if (error.status === 404) {
              console.error('Course not found. Verify the courseId:', this.courseId);
            } else {
              console.error('Error fetching course:', error.message);
            }
            this.loadingError = true; // Set flag for UI to show error message
          }
        );
      } else {
        console.error('Invalid courseId:', this.courseId);
        this.loadingError = true; // Set flag for UI to show error message
      }

      if (history.state.module) {
        this.module = history.state.module;
        console.log(`Module: ${JSON.stringify(this.module)}`);
        this.fetchLessons();
      } else {
        console.error('Module state is not provided');
      }
    });
  }

  fetchLessons(): void {
    console.log('Fetching lessons for course ID:', this.courseId);
    if (this.courseId) {
      this.lessonService.getLessonsByCourseId(this.courseId,1).subscribe(
        (data: Lesson[]) => {
          console.log('Fetched lessons:', data);
          this.lessons = data; // Assign fetched lessons to class property
        },
        (error) => {
          console.error('Error fetching lessons:', error);
        }
      );
    }
  }
  goBack(): void {
    // Example of navigating back to the previous location
    window.history.back();
  }

  navigateToCourseVideo(courseId: number, moduleId: number) {
    this.router.navigate(['/course', courseId, 'module', moduleId]);
  }
 
}
