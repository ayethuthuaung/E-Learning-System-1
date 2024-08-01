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
  nameRequiredError = false;
  createdCategoryName: string = '';
  selectedCategory: Category = new Category();
  currentUserId: string = '';
  paginatedCategories: Category[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
//submitted = false;
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
    this.nameRequiredError = !form.controls['name'].valid;
    if (form.valid && !this.nameDuplicateError) {
      this.createCategory();
    } else {
      console.log('Form is invalid');
      this.errorMessage = 'Please fill in the required fields';
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
        this.clearErrorMessages();
      },
      (error) => {
        console.error('Error creating category:', error);
        this.errorMessage = `Error creating category: ${error}`;
      }
    );
  }
  clearErrorMessages(): void {
    this.nameDuplicateError = false;
    this.nameRequiredError = false;
    this.errorMessage = '';
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
     // this.submitted = true;
    }
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
