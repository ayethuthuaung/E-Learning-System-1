import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';

import { CategoryService } from '../../services/category.service';
import { ActivatedRoute,Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import Swal from 'sweetalert2';
import { orderBy } from 'lodash';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-admin-course',
  templateUrl: './admin-course.component.html',
  styleUrls: ['./admin-course.component.css']
})
export class AdminCourseComponent implements OnInit {

  isSidebarOpen = true;
  activeTab!: string;
  category: Category = new Category();
  errorMessage: string = '';
  categories: Category[] = [];
  nameDuplicateError = false;

  course: Course = new Course();
  categoryList: number[] = [];
  submitted = false;

  loggedUser: any = '';
  userId: any;

  loading = false;
  isEditing : boolean =  false;

  courses: Course[] = [];
  status: string = 'Accept,Pending'; 

  constructor(
    private categoryService: CategoryService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router:Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] || 'createCourse';
    });

    this.getCategories();
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      console.log(this.loggedUser);

      if (this.loggedUser) {
    
        this.userId = this.loggedUser.id;
       
        
      }
    }
    this.getInstructorCourses();
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

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.submitted = false;
      this.loading = true;
    setTimeout(() => {
      this.loading = false;
      // Your submit logic
    }, 7000); 
      this.sureAlert();
      
    } else {
      this.submitted = true;
      console.log('invalid form');
      //Swal.fire('Please fill all the fields', '','error')
      this.errorMessage = 'Please fill the required fields';
    }
    
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  // setActiveTab(tab: string) {
  //   this.activeTab = tab;
  // }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (e) => console.error(e)
    });
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


 

  saveCourse(): void {
    this.course.userId = this.userId;
    this.course.status = 'In Progress';
    console.log(this.course.status);
    
    const formData = new FormData();
    
    formData.append('course', new Blob([JSON.stringify(this.course)], { type: 'application/json' }));
    if (this.course.photoFile) {
      formData.append('photo', this.course.photoFile, this.course.photoFile.name);
    }
    this.courseService.addCourseWithFormData(formData).subscribe(
      (data: Course) => {
        console.log('Course created successfully:', data);
        this.loading = false;

        this.getInstructorCourses(); // Refresh courses list after adding new course
        this.course = new Course(); // Clear the form
        this.course.status = data.status; // Update local status with returned status
        this.course.photoFile = undefined; // Clear the photo input
        this.categoryList = []; // Clear selected categories
        this.course.categories = []; // Clear selected categories in the course object
        
        // Clear checkboxes
        this.categories.forEach(category => {
          const checkbox = document.getElementById(`category_${category.id}`) as HTMLInputElement;
          if (checkbox) {
            checkbox.checked = false;
          }
        });
  
        // Clear file input
        const photo = document.getElementById('photo') as HTMLInputElement;
        if (photo) {
          photo.value = '';
        }

        this.showSuccessAlert();
      },
      (error) => {
        console.error('Error creating course:', error);
        this.loading = false;
      }
    );
  }

  triggerFileInput(): void {
    document.getElementById('photo')?.click();
  }

  editCourse(course: Course): void {

    this.isEditing = true;
    console.log(this.isEditing);
    
    console.log(course);
    
    this.course = { ...course }; 
    this.course.categorylist = course.categories.map(cat => cat.id);

   
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
        this.getInstructorCourses(); // Refresh courses list after updating the course
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

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.course.photoName = file.name;
      this.course.photoFile = file;
      this.clearErrorMessage()
    }
  }
  clearErrorMessage() {
    this.errorMessage = '';
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

  getInstructorCourses(): void {
    this.courseService.getInstructorCourses(this.userId).subscribe(
      (data: Course[]) => {
        console.log(data);
        console.log("Admin Course",data);
        
        this.courses = data;
        this.courses = data.sort((a, b) => b.createdAt - a.createdAt);
       
      },
      error => {
        console.error('Error fetching courses', error);
      }
    );
  }

  AcceptCourse(course: Course) {
    Swal.fire({
      title: 'Course Upload?',
      text: 'Are you sure to upload this course?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        course.status = 'Accept';
        this.courseService.changeStatus(course.id, 'Accept').subscribe({
          next: () => {
            this.getInstructorCourses();
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    });
  }

  navigateToCourse(courseId: number) {
    const encodedId = this.encodeId(courseId.toString());
    this.router.navigate([`admin/lesson/${encodedId}`]);
  }
  encodeId(id: string): string {
    const base64EncodedId = Base64.encode(id);
    const uuid = 'af782e56-8887-4130-9c0e-114ab93d7ebe'; // Static UUID-like string for format
    return `${uuid}-${base64EncodedId}`;

  }
  getAcceptedCourses(): Course[] {
    return this.courses.filter(course => course.status === 'Accept');
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
      text: 'Course has been created successfully.',
      confirmButtonText: 'OK'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        // Navigate to createLesson tab
        this.setActiveTab('createCourse');
      }
    });
  }

  goToCourseDetails(courseId: number): void {
    const encodedId = this.encodeId(courseId.toString());
    this.router.navigate(['/course-detail', encodedId]);
  }
  
}
