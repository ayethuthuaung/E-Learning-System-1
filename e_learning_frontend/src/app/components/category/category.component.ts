import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  category: Category = new Category();
  errorMessage: string = '';
  categories: Category[] = [];
  nameDuplicateError = false;

  constructor(private categoryService: CategoryService,
    private router:Router) { }

  ngOnInit(): void {
    this.getCategories();
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
    if (form.valid && !this.nameDuplicateError) {
      this.createCategory();
    } else {
      console.log('Form is invalid or category name already exists.');
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
}
