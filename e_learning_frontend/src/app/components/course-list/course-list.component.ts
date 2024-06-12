import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {

  courses: Course[];
  check =false;

  constructor(private courseService: CourseService,
    private router: Router) { 
      this.courses=[];
    }

  ngOnInit(): void {
    this.getCourses();
  }

  private getCourses(){
    this.courseService.getCourseList()
    .subscribe({
      next: (data) => {
      this.courses = data;
      if(this.courses.length!=0){
        this.check=true;
      }
    },    
    error: (e) => console.log(e)
  });
  
  }

  courseDetails(id: number){
    this.router.navigate(['course-details', id]);
  }

  updateCourse(id: number){
    this.router.navigate(['update-course', id]);
  }

  deleteCourse(id: number){
    this.courseService.deleteCourse(id)
    .subscribe({ 
     next: (data) => {
      console.log(data);
      this.getCourses();
    },    
    error: (e) => console.log(e)
  });
  }
}


