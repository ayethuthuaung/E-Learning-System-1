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
  selectedCategoryIds: number[] = [];
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
          this.selectedCategoryIds = course.categories.map(category => category.id);
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

  onCategoryChange(event: any, categoryId: number): void {
    if (event.target.checked) {
      this.selectedCategoryIds.push(categoryId);
    } else {
      const index = this.selectedCategoryIds.indexOf(categoryId);
      if (index !== -1) {
        this.selectedCategoryIds.splice(index, 1);
      }
    }
  }

  isChecked(categoryId: number): boolean {
    return this.selectedCategoryIds.includes(categoryId);
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

 

  onSubmit(form: NgForm): void {
    if (form.valid && !this.nameDuplicateError) {
      this.course.categories = this.allCategories.filter(category => this.selectedCategoryIds.includes(category.id));

      this.courseService.updateCourse(this.course.id, this.course).subscribe({
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
