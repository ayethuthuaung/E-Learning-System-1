import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';

import { Category } from '../models/category.model';
import { NgForm } from '@angular/forms';
import { Course } from '../models/course.model';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  
  course: Course = new Course();
  categories: Category[] = [];
  message='';
  submitted=false;
  constructor(private courseService: CourseService,
    private categoryService: CategoryService,
    private router: Router) { }

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


   

    saveCourse(){
    this.courseService.createCourse(this.course)
    .subscribe({
     next: (data) =>{
      console.log(data);
      
      this.goToCourseList();
      //this.message = 'Book was inserted successfully!';
    },    
    error: (e) => console.log(e)
  });
  }

  goToCourseList(){
    this.router.navigate(['/courses']);
  }
  
  onSubmit(form: NgForm):void{



    if (form.valid) {
      this.submitted=false;
       console.log(form.value);
        this.saveCourse();
     } else {
      this.submitted=true;
       console.log('invalid form');
     }
   
  }
}
