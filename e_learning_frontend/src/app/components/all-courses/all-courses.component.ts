import { Component, HostListener, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.css']
})
export class AllCoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchQuery: string = '';
  selectedCourse: Course | null = null;
  categories: Category[] = [];
  selectedCategory: string = '';
  filteredCategories: Category[] = [];

  isSidebarShowing = false;
  isMenuScrolled = false;
  currentPage = 1;
  pageSize = 6;
  paginationRange: number[] = [];

  constructor(
    private categoryService: CategoryService,
    private courseService: CourseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllCourses();
    this.getCategories();
  }

  private getAllCourses() {
    this.courseService.getAllCourses("Accept")
      .subscribe({
        next: (data) => {
          this.courses = data;
          this.filteredCourses = data;
          this.currentPage = 1;
          this.generatePaginationRange();
        },
        error: (e) => console.log(e)
      });
  }

  private getCategories() {
    this.categoryService.getCategoryList()
      .subscribe({
        next: (data) => {
          this.categories = data;
        
          this.categories.unshift({
            id: -1, name: 'All',
            deleted: false,
            courses: [],
            instructorName: '',
            createdBy: ''
          });
        },
        error: (e) => console.log(e)
      });
  } 
 


  filterCourses(category: string) {
    if (category.toLowerCase() === 'all') {
      this.filteredCourses = this.courses;
    } else {
      this.filteredCourses = this.courses.filter(course =>
        course.categories.some(cat => cat.name === category)
      );
    }
    this.selectedCategory = category;
    this.currentPage = 1;
    this.generatePaginationRange();
  }

  filterCoursesBySearch() {
    if (this.searchQuery.trim() === '') {
      this.filteredCourses = this.courses;
    } else {
      this.filteredCourses = this.courses.filter(course =>
        course.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (course.categories && course.categories.some(cat => cat.name.toLowerCase().includes(this.searchQuery.toLowerCase()))) ||
        course.level.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        course.duration.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (course.instructorId && course.instructorId.toString().toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (course.user && course.user.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }
    this.currentPage = 1;
    this.generatePaginationRange();
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredCourses = this.courses;
    this.currentPage = 1;
    this.generatePaginationRange();
  }

  @HostListener('window:scroll', ['$event'])
  scrollCheck() {
    this.isMenuScrolled = window.pageYOffset > 100;
  }

  openSideBar() {
    this.isSidebarShowing = true;
  }

  closeSideBar() {
    this.isSidebarShowing = false;
  }

  scrollToTop() {
    document.body.scrollIntoView({ behavior: 'smooth' });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.generatePaginationRange();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.generatePaginationRange();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.generatePaginationRange();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCourses.length / this.pageSize);
  }

  get paginatedCourses(): Course[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredCourses.slice(startIndex, startIndex + this.pageSize);
  }

  generatePaginationRange(): void {
    const rangeSize = 5;
    let start = Math.max(1, this.currentPage - Math.floor(rangeSize / 2));
    let end = Math.min(this.totalPages, start + rangeSize - 1);

    if (this.totalPages >= rangeSize) {
      if (end - start + 1 < rangeSize) {
        start = end - rangeSize + 1;
      }
    }

    this.paginationRange = [];
    for (let i = start; i <= end; i++) {
      this.paginationRange.push(i);
    }
  }
}
