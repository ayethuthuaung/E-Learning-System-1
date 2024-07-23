import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {

  categories: Category[];
  check =false;

  constructor(private categoryService: CategoryService,
    private router: Router) { 
      this.categories=[];
    }

  ngOnInit(): void {
    this.getCategories();
  }

  private getCategories(){
    this.categoryService.getCategoryList()
    .subscribe({
      next: (data) => {
      this.categories = data;
      if(this.categories.length!=0){
        this.check=true;
      }
    },    
    error: (e) => console.log(e)
  });
  
  }

  categoryDetails(id: number){
    this.router.navigate(['category-details', id]);
  }

  updateCategory(id: number){
    this.router.navigate(['category', id, 'update']);
  }

  softDeleteCategory(id: number): void {
    this.categoryService.softDeleteCategory(id).subscribe({
      next: () => {
        // Remove the course from the local array
        this.categories = this.categories.filter(category => category.id !== id);
      },
      error: (e) => console.log(e)
    });
  }
}



