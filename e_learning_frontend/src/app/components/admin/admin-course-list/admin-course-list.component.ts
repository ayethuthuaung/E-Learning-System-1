import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-admin-course-list',
  templateUrl: './admin-course-list.component.html',
  styleUrls: ['./admin-course-list.component.css']
})
export class AdminCourseListComponent implements OnInit {
  courses: Course[] = [];
  paginatedCourses: Course[] = [];
  searchTerm = '';

  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.fetchAcceptedCourses();
  }

  fetchAcceptedCourses() {
    this.courseService.getAllCourses('accept').subscribe({
      next: (data) => {
        this.courses = data;
        this.updatePaginatedCourses();
        this.totalPages = Math.ceil(this.courses.length / this.itemsPerPage);
      },
      error: (err) => console.error('Error fetching courses:', err)
    });
  }

  onSearchChange() {
    this.currentPage = 1;
    this.updatePaginatedCourses();
  }

  updatePaginatedCourses() {
    const filteredCourses = this.courses.filter(course =>
      course.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.duration.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.totalPages = Math.ceil(filteredCourses.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCourses = filteredCourses.slice(start, end);
  }

  firstPage() {
    this.currentPage = 1;
    this.updatePaginatedCourses();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCourses();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedCourses();
    }
  }

  lastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedCourses();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCourses();
    }
  }

  acceptCourse(course: Course) {
    course.status = 'Accepted';
    //this.updateCourseStatus(course);
  }

  rejectCourse(course: Course) {
    course.status = 'Rejected';
    // this.updateCourseStatus(course);
  }

  updateCourseStatus() {
    
  }

  editCourse(course: Course) {
    // Implement edit functionality
    console.log('Editing course', course);
  }

  deleteCourse(course: Course) {
    // Implement delete functionality
    console.log('Deleting course', course);
    this.courses = this.courses.filter(c => c !== course);
    this.updatePaginatedCourses(); // Update the paginated courses after deleting
  }

  detailCourse() {
    // Implement detail functionality
    //console.log('Detail course', course);
  }
}
