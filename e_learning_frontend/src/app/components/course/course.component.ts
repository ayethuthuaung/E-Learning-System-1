import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category.model';
import { Course } from '../models/course.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courses: Course[] = [];
  selectedCourse: Course | null = null; // To store the selected course details

  constructor(
    private categoryService: CategoryService,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id']; // Get the course ID from the route
      this.getCourseById(id);
    });
    this.getAllCourses();
  }

  private getCourseById(id: number): void {
    this.courseService.getCourseById(id).subscribe(
      (data: Course) => {
        this.courses = [data];
      },
      (error) => {
        console.error('Error fetching course by ID', error);
      }
    );
  }

  private getAllCourses(): void {
    this.courseService.getAllCourses().subscribe(
      (data: Course[]) => {
        this.courses = data;
      },
      (error) => {
        console.error('Error fetching courses', error);
      }
    );
  }

  onEnrolledClick(course: Course): void {
    this.selectedCourse = course;
  }

}
