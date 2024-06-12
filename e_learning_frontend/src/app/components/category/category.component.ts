import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  category: Category = new Category();
  errorMessage: string = '';
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

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

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.createCategory();
    } else {
      console.log('Invalid form');
    }
  }
  
  createCategory(): void {
    this.categoryService.createCategory(this.category).subscribe(
      //console.log(this.category)
      () => {
        console.log(this.category)
        //this.getCategories();
        this.category = new Category(); 
      },
      (error) => {
        this.errorMessage = `Error creating category: ${error}`;
      }
    );
  }
  
}
