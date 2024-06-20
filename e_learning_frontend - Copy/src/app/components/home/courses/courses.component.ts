import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Courses } from '../../models/courses.model';



@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses: Courses[] = [];
  filteredCourses: Courses[] = [];

  categories: string[] = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAllCourses()
  }

  getAllCourses() {
    this.httpClient.get('assets/data/courses.json').subscribe({
      next: (courses) => {
        this.courses = courses as Courses[];
        this.filteredCourses = courses as Courses[];
        this.getCategories()
      },
      error: (errors) => {
        console.log(errors)
      }
    })
  }

  getCategories() {
    this.categories = this.courses.map((course) => { return course.category })
    this.categories = [...new Set(this.categories)]
  }

  filterCourses(category: string) {
    this.filteredCourses = this.courses.filter(course=>course.category===category)
  }

}
