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
  categoryList: number[] = []; // Updated: Initialize categoryList as an array of numbers
  message = '';
  submitted = false;

  constructor(private courseService: CourseService,
    private categoryService: CategoryService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        console.table(data);
        this.categories = data;
      },
      error: (e) => console.error(e)
    });
  }

  saveCourse(): void {
    
    this.course.categorylist = this.categoryList; // Updated: Assign categoryList to course.categorylist
    this.courseService.createCourse(this.course)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.goToCourseList();
          //this.message = 'Book was inserted successfully!';
        },
        error: (e) => console.log(e)
      });
  }

  goToCourseList(): void {
    this.router.navigate(['/courses']);
  }
  
  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.submitted = false;
      console.log(form.value);
      this.saveCourse();
    } else {
      this.submitted = true;
      console.log('invalid form');
    }
  }

  // Function to handle selection/deselection of categories
  toggleCategory(categoryId: number): void {
    if (this.categoryList.includes(categoryId)) {
      // Remove categoryId from categoryList if already selected
      this.categoryList = this.categoryList.filter(id => id !== categoryId);
    } else {
      // Add categoryId to categoryList if not selected
      this.categoryList.push(categoryId);
    }
  }
}
