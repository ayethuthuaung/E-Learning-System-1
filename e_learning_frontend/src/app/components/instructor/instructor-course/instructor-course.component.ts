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
  styleUrls: ['./instructor-course.component.css']
})
export class InstructorCourseComponent implements OnInit {
  isSidebarOpen = true;
  activeTab: string = 'createCourse';
  categories: Category[] = [];
  nameDuplicateError = false;
  course: Course = new Course();
  submitted = false;
  errorMessage: string = '';
  loading = false;

  loggedUser: any = '';
  userId: any;

  courses: Course[] = [];
  status: string = 'Accept,Pending';

  constructor(
    private categoryService: CategoryService,
    private courseService: CourseService,
    private router: Router
  ) { }

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

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.submitted = false;
      this.loading = true;
      this.saveCourse();
    } else {
      this.submitted = true;
      console.log('Invalid form');
    }
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
        this.loading = false;
        this.router.navigate(['/courses']);
      },
      (error) => {
        console.error('Error creating course:', error);
        this.loading = false;
      }
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.course.photoFile = file;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
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
