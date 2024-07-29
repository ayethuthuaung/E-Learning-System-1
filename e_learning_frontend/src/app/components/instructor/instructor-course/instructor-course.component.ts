import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Category } from '../../models/category.model';

import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import Swal from 'sweetalert2';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-instructor-course',
  templateUrl: './instructor-course.component.html',
  styleUrl: './instructor-course.component.css'
})
export class InstructorCourseComponent implements OnInit, OnDestroy {
  @ViewChild('courseForm') courseForm!: NgForm; // Access the form template reference

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

  loading = false;
  isEditing : boolean =  false;

  courses: Course[] = [];
  status: string = 'Accept,Pending'; 
  availableNames: string[] = [];
  private pollingInterval: any;
  private pollingIntervalMs: number = 3000; // Polling interval in milliseconds


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
    this.getInstructorCourses();
    this.startPolling(); // Start polling for updates
  }

  ngOnDestroy(): void {
    this.stopPolling(); // Clean up polling when component is destroyed
  }

  private startPolling() {
    this.pollingInterval = setInterval(() => {
      this.getInstructorCourses(); // Poll for course updates
    }, this.pollingIntervalMs);
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
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
      
      this.sureAlert();
      
    } else {
      this.submitted = true;
      console.log('invalid form');
      this.errorMessage = 'Please fill all the required fields';
      
    }
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

        Swal.fire({
          title: 'Success!',
          text: 'Course created successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
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
    this.course.photoName = course.photoName; // Ensure the photoName is set
    console.log(this.course.photo);
    
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
        this.course.categorylist = [];
        this.course.categories = [];
        this.categories = [];
        this.categoryList=[];
        console.log(this.course.categories);
        console.log(this.course.categorylist);
        console.log(this.categories);


        this.isEditing = false; // Exit editing mode
        if (this.courseForm) {
          this.courseForm.resetForm();
        }
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

  getInstructorCourses(): void {
    this.courseService.getInstructorCourses(this.userId).subscribe(
      (data: Course[]) => {
        console.log(data);
        console.log("Instructor Course",data);
        
        this.courses = data;
        this.courses = data.sort((a, b) => b.createdAt - a.createdAt);
        this.availableNames = [...new Set(this.courses.map(course => course.level))];
        this.updatePaginatedInstructorCourses();
        this.totalPages = Math.ceil(this.courses.length / this.itemsPerPage);
   
      },
      error => {
        console.error('Error fetching courses', error);
      }
    );
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
    this.router.navigate([`instructor/lesson/${courseId}`]);
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
      icon: 'info',
      title: 'Request Admin Approval',
      text: 'Your request has been submitted and is awaiting admin approval.',
      confirmButtonText: 'OK'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        // Navigate to createLesson tab
        this.setActiveTab('createLesson');
      }
    });
  }
 

  // Course List
  searchTerm = '';

  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;
  paginatedInstructorCourses: Course[] = [];

  sortKey: string = '';
sortDirection: string = 'asc';

filterTerm = '';
  filterKey = '';



  onSearchChange() {
    this.currentPage = 1;
    this.updatePaginatedInstructorCourses();
  }

  onSortChange(key: string, direction: string) {
    this.sortKey = key;
    this.sortDirection = direction;
    this.updatePaginatedInstructorCourses();
  }

  onFilterChange(event: { key: string, term: string }) {
    this.filterKey = event.key;
    this.filterTerm = event.term;
    this.updatePaginatedInstructorCourses();
  }

  updatePaginatedInstructorCourses() {
    let filteredInstructorCourses = this.courses.filter(course =>
      course.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.duration.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.studentCount?.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) 
      );

      if (this.sortKey && (this.sortDirection === 'asc' || this.sortDirection === 'desc')) {
        filteredInstructorCourses = orderBy(filteredInstructorCourses, [this.sortKey], [this.sortDirection as 'asc' | 'desc']);
      }
      if (this.filterKey && this.filterTerm) {
        filteredInstructorCourses = filteredInstructorCourses.filter(course =>
          (course as any)[this.filterKey].toLowerCase().includes(this.filterTerm.toLowerCase())
        );
      }

    this.totalPages = Math.ceil(filteredInstructorCourses.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedInstructorCourses = filteredInstructorCourses.slice(start, end);
  }

  firstPage() {
    this.currentPage = 1;
    this.updatePaginatedInstructorCourses();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedInstructorCourses();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedInstructorCourses();
    }
  }

  lastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedInstructorCourses();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedInstructorCourses();
    }
  }

  goToCourseDetails(courseId: number): void {
    this.router.navigate(['/course-detail', courseId]);
  }
  
  exportCourses(): void {
    if (this.userId) {
      this.courseService.exportCoursesForInstructor(this.userId).subscribe(
        (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'instructor_courses.xls'; // Name of the file
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error exporting courses:', error);
        }
      );
    }
  }

  exportCoursesPdf(): void {
    if (this.userId) {
      this.courseService.exportCoursesForInstructorPDf(this.userId).subscribe(
        (response: Blob) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'courses.pdf'; // Name of the file
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error exporting courses:', error);
        }
      );
    }
  }
  
  


}