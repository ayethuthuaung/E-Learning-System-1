import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

declare var Swal: any; 

@Component({
  selector: 'app-instructor-category',
  templateUrl: './instructor-category.component.html',
  styleUrl: './instructor-category.component.css'
})
export class InstructorCategoryComponent implements OnInit {
  isSidebarOpen = true;
  activeTab: string = 'createCategory';
  category: Category = new Category();
  errorMessage: string = '';
  categories: Category[] = [];
  nameDuplicateError = false;
  nameRequiredError = false;


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
      console.log('Form is invalid.');
      this.nameRequiredError=true;
    }
  }

  createCategory(): void {
    this.categoryService.createCategory(this.category).subscribe(
      () => {
        console.log('Category created successfully');
        this.showSuccessAlert(); // Call the success alert
        //this.goToCategoryList();

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



  showSuccessAlert(): void {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Category created successfully.',
      confirmButtonText: 'OK'
    });
  }

}
