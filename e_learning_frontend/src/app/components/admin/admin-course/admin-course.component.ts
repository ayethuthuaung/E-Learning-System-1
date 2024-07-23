import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';

import { CategoryService } from '../../services/category.service';
import { ActivatedRoute,Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import Swal from 'sweetalert2';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-admin-course',
  templateUrl: './admin-course.component.html',
  styleUrls: ['./admin-course.component.css']
})
export class AdminCourseComponent implements OnInit {

  isSidebarOpen = true;
  activeTab: string = 'createCourse';
  category: Category = new Category();
  errorMessage: string = '';
  categories: Category[] = [];
  nameDuplicateError = false;
  
  course: Course = new Course();
  courses: Course[] = [];
  categoryList: number[] = [];
  submitted = false;

  loggedUser: any = null;
  userId: any;

  loading = false;
  isEditing : boolean =  false;

  constructor(
    private categoryService: CategoryService,
    private courseService: CourseService,

    private router:Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getCategories();
    this.getCourses(); // Fetch courses on init

    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      console.log(this.loggedUser);

      if (this.loggedUser) {
    
        this.userId = this.loggedUser.id;
        
      }
    }
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
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

  getCourses(): void {
    this.courseService.getCourseList().subscribe(
      (data: Course[]) => {
        this.courses = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      (error) => {
        this.errorMessage = `Error fetching courses: ${error}`;
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
      this.loading = true;
      this.sureAlert();
      
    } else {
      this.submitted = true;
      console.log('invalid form');
      //Swal.fire('Please fill all the fields', '','error')
      this.errorMessage = 'Please fill the required fields';
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
    if (tab === 'courseList') {
      this.getCourses(); // Refresh courses list when switching to course list tab
    }
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
    this.course.status = 'In Progress';
    const formData = new FormData();
    formData.append('course', new Blob([JSON.stringify(this.course)], { type: 'application/json' }));
    if (this.course.photoFile) {
      formData.append('photo', this.course.photoFile, this.course.photoFile.name);
    }
  
    this.courseService.addCourseWithFormData(formData).subscribe(
      (data: Course) => {
        console.log('Course created successfully:', data);
        this.loading = false;

        this.getCourses(); // Refresh the course list after creation
        this.course = new Course(); // Clear the form
        this.course.status = data.status; // Update local status with returned status
        this.course.photoFile = undefined; // Clear the photo input
        this.course.categories = []; // Clear selected categories
        this.showSuccessAlert();
        
      },
      (error) => {
        console.error('Error creating course:', error);
        this.loading = false;
      }
    );
  }

  confirmUpdateCourse(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this course?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateCourse();
      }
    });
  }

  updateCourse(): void {
    console.log("Update Course");
    
    const formData = new FormData();
    formData.append('courseDto', new Blob([JSON.stringify(this.course)], { type: 'application/json' }));
    if (this.course.photoFile) {
      formData.append('photo', this.course.photoFile);
    }
    console.log("Hi");
    this.courseService.updateCourse(this.course.id, formData).subscribe(
      (updatedCourse: Course) => {
        console.log('Course updated successfully:', updatedCourse);
        this.loading = false;
        this.getCourses(); // Refresh courses list after updating the course
        this.course = new Course(); // Clear the form
        this.isEditing = false; // Exit editing mode
        this.showSuccessAlert1();
      },
      (error) => {
        console.error('Error updating course:', error);
        this.loading = false;
      }
    );
  }

  showSuccessAlert1(): void {
    Swal.fire({
      title: 'Updated!',
      text: 'Course updated successfully.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
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

  navigateToCourse(courseId: number) {
    this.router.navigate([`admin/lesson/${courseId}`]);
  }

  getAcceptedCourses(): Course[] {
    return this.courses.filter(course => course.status === 'Accept' && course.userId === this.userId);
  }


  sureAlert(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Do you want to create this course?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {
        this.saveCourse();
      } else {
        this.loading = false;
      }
    });
  }


  showSuccessAlert(): void {
    Swal.fire({
      icon: 'success',
      title: 'Successful',
      text: 'Course has been created Successfully.',
      confirmButtonText: 'OK'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        // Navigate to createLesson tab
        this.clearForm();
        this.setActiveTab('createCourse');
      }
    });
  }

  clearForm(): void {
    this.course = new Course();
    this.course.status = '';
    this.course.photoFile = undefined;
    this.course.categories = [];
  }

  pendingCourse(course: Course) {
    Swal.fire({
      title: 'Request to Admin?',
      text: 'Are you sure request to admin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        course.status = 'Pending';
        this.courseService.changeStatus(course.id, 'Pending').subscribe({
          next: () => {
            this.getCourses();
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    });
  }

  editCourse(course: Course): void {

    this.isEditing = true;
    console.log(this.isEditing);
    
    console.log(course);
    
    this.course = { ...course }; 
    this.course.categorylist = course.categories.map(cat => cat.id);

   
  }


  deleteCourse(courseId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Course?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.softDeleteCourse(courseId).subscribe(
          () => {
            this.courses = this.courses.filter(course => course.id !== courseId);
            Swal.fire('Deleted!', 'The module has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting module:', error);
            Swal.fire('Error!', 'Failed to delete the module.', 'error');
          }
        );
      }
    });
  }
  
}
