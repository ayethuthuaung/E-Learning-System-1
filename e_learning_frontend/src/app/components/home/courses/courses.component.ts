import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from './../../services/course.service';
import { Course } from './../../models/course.model';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { UserCourseService } from '../../services/user-course.service';
import { SlideConfig } from '../../models/slide-config.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  trendingCourses: Course[] = [];
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  latestCourses: Course[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  

  constructor(
    private categoryService: CategoryService,
    private courseService: CourseService,
    private userCourseService: UserCourseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchTrendingCourses();
    this.getLatestAcceptedCourses();
    this.getAllCourses();
    this.getCategories();
    
  }

  private getAllCourses() {
    this.courseService.getAllCourses('Accept')
      .subscribe({
        next: (data) => {
          this.courses = data;
          this.filteredCourses = data;
        },
        error: (e) => console.error('Error fetching all courses:', e)
      });
  }

  private getCategories() {
    this.categoryService.getCategoryList()
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (e) => console.error('Error fetching categories:', e)
      });
  }

  filterCourses(category: string) {
    if (category === 'all') {
      this.filteredCourses = this.courses;
    } else {
      this.filteredCourses = this.courses.filter(course =>
        course.categories.some(cat => cat.name === category)
      );
    }
    this.selectedCategory = category;
  }

  private getLatestAcceptedCourses() {
    this.courseService.getLatestAcceptedCourses()
      .subscribe({
        next: (data) => {
          this.latestCourses = data;
          
        },
        error: (e) => console.error('Error fetching latest accepted courses:', e)
      });
  }

  fetchTrendingCourses(): void {
    this.userCourseService.getTrendingCourses()
      .subscribe(
        (courses: Course[]) => {
          this.trendingCourses = courses;
          
        },
        (error) => {
          console.error('Error fetching trending courses:', error);
        }
      );
  }

 
}
