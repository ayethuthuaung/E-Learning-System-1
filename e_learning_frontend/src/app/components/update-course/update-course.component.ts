import { Component, OnDestroy, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrl: './update-course.component.css'
})
export class UpdateCourseComponent implements OnInit {

  id!: number;
  course: Course= new Course();
  message ='';
  constructor(private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.courseService.getCourseById(this.id)
    .subscribe({
      next: (data) => {
      this.course = data;
    },    
    error: (e) => console.log(e)
  });
  }

  onSubmit(){
    this.courseService.updateCourse(this.id, this.course)
    .subscribe({
      next: (data )=>{
      this.goToCourseList();
    },    
    error: (e) => console.log(e)
  });
  }

  goToCourseList(){
    this.router.navigate(['/courses']);
  }

  addCategory(): void {
    const newCategory = new Category();
    this.course.categories.push(newCategory);
  }

  removeCategory(categoryId: number | undefined): void {
    if (categoryId !== undefined) {
      this.course.categories = this.course.categories.filter(category => category.id !== categoryId);
    }
  }
}

