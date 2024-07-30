import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth/auth.service';

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
 submitted= false;

  createdCategoryName: string = '';
  selectedCategory: Category = new Category();
  currentUserId: string = '';
  paginatedCategories: Category[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  loggedUser: any = '';
 userId: any;
 isEditing : boolean =  false;

  @ViewChild('updateCategoryDialog') updateCategoryDialog!: TemplateRef<any>;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserId();
    this.getCategories();
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      if (this.loggedUser) {
        this.userId = this.loggedUser.id;
      }
    }
  }

  getCurrentUserId(): void {
    this.currentUserId = this.authService.getLoggedInUserId().toString(); // Ensure it's a string
  }

  getCategories(): void {
    this.categoryService.getCategoryList().subscribe(
      (data: Category[]) => {
        this.categories = data.filter(category => !category.deleted);
        this.updatePagination();
      },
      (error) => {
        this.errorMessage = `Error fetching categories: ${error}`;
      }
    );
  }


  validateCategoryName(name: string): void {
    if (!name.trim()) {
      this.submitted = true;
      this.nameDuplicateError = false;
      return;
    }

    this.submitted = false;
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


  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.isEditing) {
        this.updateCategory();
      } else {
        this.createCategory();
      }
    } else {
      this.errorMessage = 'Please fill the field.';
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
  editCategory(category: Category): void {
    this.isEditing = true;
    this.category = { ...category };
  }

  confirmUpdateCategory(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.updateCategory();
      }
    });
  }

  updateCategory(): void {
    if (this.category.id) {
      this.categoryService.updateCategory(this.category.id, this.category).subscribe(
        (updatedCategory: Category) => {
          console.log('Category updated successfully:', updatedCategory);
          this.category = new Category();
          this.isEditing = false;
          this.showSuccessAlert1();
          this.getCategories();
        },
        (error) => {
          console.error('Error updating category:', error);
          this.errorMessage = `Error updating category: ${error}`;
        }
      );
    }
  }


  showSuccessAlert1(): void {
    Swal.fire({
      title: 'Updated!',
      text: 'Category updated successfully.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  
  softDeleteCategory(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "This category will be soft deleted and won't be visible in the category list.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.categoryService.softDeleteCategory(id).subscribe({
          next: () => {
            this.categories = this.categories.filter(category => category.id !== id);
            this.getCategories();
            // Optionally show a brief notification or just handle the UI update
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            this.errorMessage = `Error deleting category: ${error}`;
          }
        });
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  setActiveTab(tab: 'createCategory' | 'categoryList'): void {
    this.activeTab = tab;
    if (tab === 'categoryList') {
      this.updatePagination();
    }
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

  onSearch(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.totalPages = Math.ceil(filteredCategories.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCategories = filteredCategories.slice(startIndex, endIndex);
    console.log('Filtered Categories:', filteredCategories); // Debugging line
    console.log('Paginated Categories:', this.paginatedCategories); // Debugging line
  }

  firstPage() {
    this.currentPage = 1;
    this.updatePagination();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  lastPage() {
    this.currentPage = this.totalPages;
    this.updatePagination();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

}
