import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { Category } from '../models/category.model';
import { CourseService } from '../services/course.service';
import { CategoryService } from '../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.css']
})
export class UpdateCourseComponent implements OnInit {

  course: Course = new Course();
  selectedCategories: Category[] = [];
  allCategories: Category[] = [];
  nameDuplicateError: boolean = false;
  photoFile: File | null = null;

  constructor(
    private courseService: CourseService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchCourseDetails();
    this.fetchAllCategories();
  }

  fetchCourseDetails(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    if (!isNaN(courseId) && courseId > 0) {
      this.courseService.getCourseById(courseId).subscribe({
        next: (course) => {
          this.course = course;
          this.selectedCategories = course.categories;
        },
        error: (error) => {
          console.error('Error fetching course details:', error);
          this.router.navigate(['/error']); // Redirect to an error page if needed
        }
      });
    } else {
      console.error('Invalid course ID');
      this.router.navigate(['/error']); // Redirect to an error page if needed
    }
  }

  fetchAllCategories(): void {
    this.categoryService.getCategoryList().subscribe({
      next: (categories) => {
        this.allCategories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  onCategoryChange(event: any, category: Category): void {
    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      const index = this.selectedCategories.findIndex(c => c.id === category.id);
      if (index !== -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }

  isCategorySelected(category: Category): boolean {
    return this.selectedCategories.some(c => c.id === category.id);
  }

  checkDuplicateCourseName(): void {
    if (this.course.name) {
      this.courseService.isCourseNameAlreadyExists(this.course.name).subscribe({
        next: (exists) => {
          this.nameDuplicateError = exists;
        },
        error: (error) => {
          console.error('Error checking course name:', error);
        }
      });
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.photoFile = file;
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid && !this.nameDuplicateError) {
      const courseId = this.course.id ?? 0; 
      this.course.categories = this.selectedCategories;

      const formData = new FormData();
      formData.append('course', new Blob([JSON.stringify(this.course)], { type: 'application/json' }));
      if (this.photoFile) {
        formData.append('photo', this.photoFile);
      }

      this.courseService.updateCourse(courseId, formData).subscribe({
        next: (data) => {
          console.log('Course updated successfully:', data);
          this.router.navigate(['/courses']); 
        },
        error: (error) => {
          console.error('Error updating course:', error);
        }
      });
    } else {
      console.log('Form is invalid or course name is duplicate');
    }
  }
}
