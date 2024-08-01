import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service'; // Adjust the path as necessary
import { Course } from '../models/course.model'; // Adjust the path as necessary

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit {
  courses: Course[] = [];
  searchQuery: string = '';
  paginatedCourses: Course[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  paginationRange: number[] = [];
  userId: any;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      const loggedUser = JSON.parse(storedUser);
      if (loggedUser && loggedUser.id) {
        this.userId = loggedUser.id;
        this.getCourses(this.userId);
      }
    }
  }

  getCourses(userId: number): void {
    this.courseService.getAcceptInstructorCourses(userId).subscribe(courses => {
      this.courses = courses;
      this.updatePagination();
    });
  }

  filterCoursesBySearch(): void {
    if (this.searchQuery.trim() !== '') {
      this.paginatedCourses = this.courses.filter(course =>
        course.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.updatePagination();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.courses.length / 10);
    this.paginationRange = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginateCourses();
  }

  paginateCourses(): void {
    const startIndex = (this.currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    this.paginatedCourses = this.courses.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.paginateCourses();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateCourses();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateCourses();
    }
  }
}
