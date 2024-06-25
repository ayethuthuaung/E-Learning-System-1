import { CourseService } from './../../services/course.service';
import { Course } from './../../models/course.model';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Courses } from '../../models/courses.model';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  course: Course[] = [];
  filteredCourses: Course[] = [];

  categories: Category[]  = [];
  selectedCategory: string = '';

  constructor(
    private categoryService: CategoryService,
    private courseService: CourseService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCategories();
    this.getAllCourses();
  }

  private getAllCourses() {
    this.courseService.getAllCourses()
    .subscribe({
      next: (data) => {
        this.course = data;
        this.filteredCourses = data;
      },
      error: (e) => console.log(e)
    })
  }

  private getCategories(){
    this.categoryService.getCategoryList()
    .subscribe({
      next: (data) => {
      this.categories = data;
      
    },    
    error: (e) => console.log(e)
  });
  }

  filterCourses(category: string) {
    if (category === 'all') {
      this.filteredCourses = this.course;
    } else {
      this.filteredCourses = this.course.filter(course => 
        course.categories.some(cat => cat.name === category)
      );
    }
    this.selectedCategory = category;
  }
}
