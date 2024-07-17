import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

declare var Swal: any;

@Component({
  selector: 'app-instructor-category',
  templateUrl: './instructor-category.component.html',
  styleUrls: ['./instructor-category.component.css']
})
export class InstructorCategoryComponent implements OnInit {
  isSidebarOpen = true;
  activeTab: 'createCategory' | 'categoryList' = 'createCategory';
  category: Category = new Category();
  errorMessage: string = '';
  categories: Category[] = [];
  nameDuplicateError = false;
  nameRequiredError = false;
  createdCategoryName: string = '';
  selectedCategory: Category = new Category();

  @ViewChild('updateCategoryDialog') updateCategoryDialog!: TemplateRef<any>;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private dialog: MatDialog
  ) {}

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
    if (!name.trim()) {
      this.nameRequiredError = true;
      this.nameDuplicateError = false;
      return;
    }

    this.nameRequiredError = false;
    this.categoryService.isCategoryNameAlreadyExists(name).subscribe(
      (exists: boolean) => {
        this.nameDuplicateError = exists;
      },
      (error) => {
        console.error('Error checking category name:', error);
        this.errorMessage = `Error checking category name: ${error}`;
      }
    );
  }

  onSubmit(form: NgForm): void {
    if (form.valid && !this.nameDuplicateError) {
      if (this.category.id) {
        this.updateCategory(this.category.id);
      } else {
        this.createCategory();
      }
    } else {
      console.log('Form is invalid.');
      this.nameRequiredError = true;
    }
  }

  createCategory(): void {
    this.categoryService.createCategory(this.category).subscribe(
      () => {
        console.log('Category created successfully');
        this.showSuccessAlert('Category created successfully.');
        this.createdCategoryName = this.category.name;
        this.getCategories();
        this.category = new Category();
      },
      (error) => {
        console.error('Error creating category:', error);
        this.errorMessage = `Error creating category: ${error}`;
      }
    );
  }

  updateCategory(id: number): void {
    this.router.navigate(['/category', id, 'update']);
  }

  openUpdateDialog(category: Category): void {
    this.selectedCategory = { ...category };
    this.dialog.open(this.updateCategoryDialog);
  }

  onUpdateSubmit(form: NgForm): void {
    if (form.valid && !this.nameDuplicateError) {
      this.categoryService.updateCategory(this.selectedCategory.id!, this.selectedCategory).subscribe(
        () => {
          console.log('Category updated successfully');
          this.showSuccessAlert('Category updated successfully.');
          this.getCategories();
          this.dialog.closeAll();
        },
        (error) => {
          this.errorMessage = `Error updating category: ${error}`;
        }
      );
    } else {
      console.log('Form is invalid.');
      this.nameRequiredError = true;
    }
  }

  softDeleteCategory(id: number): void {
    this.categoryService.softDeleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(category => category.id !== id);
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.errorMessage = `Error deleting category: ${error}`;
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  setActiveTab(tab: 'createCategory' | 'categoryList'): void {
    this.activeTab = tab;
  }

  showSuccessAlert(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      confirmButtonText: 'OK'
    }).then(() => {
      this.setActiveTab('categoryList');
    });
  }

  closeUpdateDialog(): void {
    this.dialog.closeAll();
  }
}
