import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  courses: Course[] = [];
  check = false;

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
    this.getCourses();
  }

  private getCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.check = this.courses.length !== 0;
      },
      error: (e) => console.log(e)
    });
  }

  courseDetails(id: number): void {
    this.router.navigate(['course-details', id]);
  }

  updateCourse(id: number): void {
    this.router.navigate(['course', id, 'update']);
  }

  softDeleteCourse(id: number): void {
    this.courseService.softDeleteCourse(id).subscribe({
      next: () => {
        this.courses = this.courses.filter(course => course.id !== id);
      },
      error: (e) => console.log(e)
    });
  }

  getPhotoUrl(photoUrl: string): string {
    return photoUrl ? photoUrl : 'assets/default-photo.jpg'; // Default photo if none provided
  }
}
