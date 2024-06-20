import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category.model';
import { Course } from '../models/course.model';
import { CategoryService } from '../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {

  category: Category = new Category();
  allCourses: Course[] = [];
  selectedCourseIds: number[] = [];
  nameDuplicateError: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchCategoryDetails();
    this.fetchAllCourses();
  }

  fetchCategoryDetails(): void {
    const categoryId = Number(this.route.snapshot.paramMap.get('categoryId'));
    if (!isNaN(categoryId) && categoryId > 0) {
      this.categoryService.getCategoryById(categoryId).subscribe({
        next: (category) => {
          this.category = category;
          this.selectedCourseIds = category.courses.map(course => course.id);
        },
        error: (error) => {
          console.error('Error fetching category details:', error);
          // Handle error (e.g., redirect to an error page)
        }
      });
    } else {
      console.error('Invalid category ID');
      // Handle error (e.g., redirect to an error page)
    }
  }

  fetchAllCourses(): void {
    this.courseService.getCourseList().subscribe({
      next: (courses) => {
        this.allCourses = courses;
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
        // Handle error (e.g., redirect to an error page)
      }
    });
  }

  isCourseSelected(course: Course): boolean {
    return this.selectedCourseIds.includes(course.id);
  }

  checkDuplicateCategoryName(): void {
    if (this.category.name) {
      this.categoryService.isCategoryNameAlreadyExists(this.category.name).subscribe({
        next: (exists) => {
          this.nameDuplicateError = exists;
        },
        error: (error) => {
          console.error('Error checking category name:', error);
        }
      });
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid && !this.nameDuplicateError) {
      this.category.courses = this.allCourses.filter(course => this.selectedCourseIds.includes(course.id));

      this.categoryService.updateCategory(this.category.id, this.category).subscribe({
        next: (data) => {
          console.log('Category updated successfully:', data);
          // Optionally navigate to another page upon successful update
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error updating category:', error);
          // Handle error (e.g., display error message)
        }
      });
    } else {
      console.log('Form is invalid or category name is duplicate');
      // Optionally handle form validation errors
    }
  }
}
