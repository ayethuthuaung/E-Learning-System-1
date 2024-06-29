import { Component, OnInit } from '@angular/core';

import { Category } from '../models/category.model';
import { NgForm } from '@angular/forms';
import { Course } from '../models/course.model';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { CourseService } from '../services/course.service';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course: Course = new Course();
  categories: Category[] = [];
  categoryList: number[] = [];
  nameDuplicateError = false;
  submitted = false;

  constructor(
    private courseService: CourseService,
    private categoryService: CategoryService,
    private router: Router,
    private webSocketService:WebSocketService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (e) => console.error(e)
    });
  }

  validateCourseName(name: string): void {
    this.courseService.isCourseNameAlreadyExists(name).subscribe(
      (exists: boolean) => {
        this.nameDuplicateError = exists;
      },
      (error) => {
        console.error('Error checking course name:', error);
      }
    );
  }

  saveCourse(): void {
    const formData = new FormData();
    formData.append('course', new Blob([JSON.stringify(this.course)], { type: 'application/json' }));
    if (this.course.photoFile) {
      formData.append('photo', this.course.photoFile, this.course.photoFile.name);
    }

    this.courseService.addCourseWithFormData(formData).subscribe(
      (data) => {
        console.log('Course created successfully:', data);
        
        // notification when add course
        this.webSocketService.sendNotification('New course added: ' + data.name);

        this.router.navigate(['/courses']);
      },
      (error) => {
        console.error('Error creating course:', error);
      }
    );
}
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.course.photoFile = file;
    }
  }

  goToCourseList(): void {
    this.router.navigate(['/courses']);
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.submitted = false;
      this.saveCourse();
    } else {
      this.submitted = true;
      console.log('invalid form');
    }
  }

  
  
  toggleCategories(event:any,category:any){
   
    this.course.categories[category]=event.target.checked
    if(event.target.checked){
      this.course.categories.push(this.categories[category.id-1])
    }
    else{
      console.log("else");
      
      const i=this.course.categories.indexOf(this.categories[category.id])
      if(i!==-1){
        this.course.categories.splice(i,1)
      }
    }
  console.log(this.course);

  }
    // saveCourse(): void {
  //   this.course.categorylist = this.categoryList; 
  //   this.courseService.addCourse(this.course).subscribe({
  //     next: (data) => {
  //       console.log('Course created successfully:', data);
  //       this.goToCourseList();
  //     },
  //     error: (error) => {
  //       console.error('Error creating course:', error);
  //       if (error.error instanceof ErrorEvent) {
  //         console.error('Client-side error occurred:', error.error.message);
  //       } else {
  //         console.error(`Server-side error occurred. Status: ${error.status}, Message: ${error.error}`);
  //       }
  //       // Optionally, handle the error more gracefully (e.g., show error message to user)
  //     }
  //   });
  // }
}