import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';

import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-instructor-course',
  templateUrl: './instructor-course.component.html',
  styleUrl: './instructor-course.component.css'
})
export class InstructorCourseComponent implements OnInit {
  isSidebarOpen = true;
  activeTab: string = 'createCourse';
  category: Category = new Category();
  errorMessage: string = '';
  categories: Category[] = [];
  nameDuplicateError = false;

  course: Course = new Course();
  categoryList: number[] = [];
  submitted = false;

  loggedUser: any = '';
  userId: any;

  courses: Course[] = [];
  status: string = 'Accept,Pending';

  constructor(
    private categoryService: CategoryService,
    private courseService: CourseService,
    private router:Router) { }

  ngOnInit(): void {
    this.getCategories();
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      console.log(this.loggedUser);

      if (this.loggedUser) {
    
        this.userId = this.loggedUser.id;
       
        
      }
    }
    this.getAllCourses();
  }

  getCategories(): void {
    this.categoryService.getCategoryList().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        this.errorMessage = `Error fetching categories: ${error}`;
      }
    );
  }

  validateCategoryName(name: string): void {
    this.categoryService.isCategoryNameAlreadyExists(name).subscribe(
      (exists: boolean) => {
        this.nameDuplicateError = exists;
      },
      (error) => {
        console.error('Error checking category name:', error);
      }
    );
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

  createCategory(): void {
    this.categoryService.createCategory(this.category).subscribe(
      () => {
        console.log('Category created successfully');
        this.goToCategoryList();

        this.getCategories(); // Refresh the list after creation
        this.category = new Category(); // Clear the form
      },
      (error) => {
        this.errorMessage = `Error creating category: ${error}`;
      }
    );
  }
  goToCategoryList(): void {
    this.router.navigate(['/categories']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  setActiveTab(tab: string) {
    this.activeTab = tab;
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
    this.course.userId = this.userId;
    this.course.status = 'Pending';
    const formData = new FormData();
    
    formData.append('course', new Blob([JSON.stringify(this.course)], { type: 'application/json' }));
    if (this.course.photoFile) {
      formData.append('photo', this.course.photoFile, this.course.photoFile.name);
    }

    this.courseService.addCourseWithFormData(formData).subscribe(
      (data) => {
        console.log('Course created successfully:', data);
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

  toggleCategory(event: any, categoryId: number): void {
    if (event.target.checked) {
      this.categoryList.push(categoryId); // Add category ID to the list
    } else {
      this.categoryList = this.categoryList.filter(id => id !== categoryId); // Remove category ID from the list
    }
  }

  toggleCategories(event: any, category: Category) {

    if (event.target.checked) {

      this.course.categories.push(category);
    } else {
      const index = this.course.categories.findIndex(cat => cat.id === category.id);
      if (index !== -1) {
        this.course.categories.splice(index, 1);
      }
    }
    console.log(this.course.categories);
    console.log(this.course);
    
    
  }

  getAllCourses(): void {
    this.courseService.getAllCourses(this.status).subscribe(
      (data: Course[]) => {
        this.courses = data;
      },
      error => {
        console.error('Error fetching courses', error);
      }
    );
  }
}
