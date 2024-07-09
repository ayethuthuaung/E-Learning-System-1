import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrl: './all-courses.component.css'
})
export class AllCoursesComponent implements OnInit {
  course: Course[] = [];
  filteredCourses: Course[] = [];

  selectedCourse: Course | null = null;

 

  constructor(
    private courseService: CourseService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllCourses();
  }

  private getAllCourses() {

    this.courseService.getAllCourses("Accept")
    .subscribe({
      next: (data) => {
        this.course = data;
        this.filteredCourses = data;
        console.log(data);
      },
      error: (e) => console.log(e)
    })

  }
  

}
