import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { WebSocketService } from '../../services/websocket.service';

declare var Swal: any;

@Component({
  selector: 'app-admin-course-list',
  templateUrl: './admin-course-list.component.html',
  styleUrls: ['./admin-course-list.component.css']
})
export class AdminCourseListComponent implements OnInit {
  courses: Course[] = [];
  paginatedCourses: Course[] = [];
  searchTerm = '';
  statusFilter = 'all';
  selectedCourse: Course | null = null;

  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;

  constructor(private courseService: CourseService,private webSocketService:WebSocketService) {}

  ngOnInit() {
    this.fetchCourses();
  }

  fetchCourses() {
    this.courseService.getAllCourses(this.statusFilter).subscribe({
      next: (data) => {
        this.courses = data;
        this.updatePaginatedCourses();
        this.totalPages = Math.ceil(this.courses.length / this.itemsPerPage);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSearchChange() {
    this.updatePaginatedCourses();
  }

  onStatusChange() {
    this.fetchCourses();
  }

  acceptCourse(course: Course) {
    course.status = 'Accept';
    this.courseService.changeStatus(course.id, 'Accept').subscribe({
      next: () => {
        Swal.fire('Success!', 'Course accepted successfully!', 'success');
        this.updatePaginatedCourses();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  rejectCourse(course: Course) {
    course.status = 'Reject';
    this.courseService.changeStatus(course.id, 'Reject').subscribe({
      next: () => {
        Swal.fire('Success!', 'Course rejected successfully!', 'success');
        this.updatePaginatedCourses();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
 
  openModal(course: Course) {
    // You can use a service or other logic to open the modal
    this.selectedCourse = course;
    const modal = document.getElementById('fullScreenModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal() {
    this.selectedCourse = null;
    const modal = document.getElementById('fullScreenModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  updatePaginatedCourses() {
    const filteredCourses = this.courses.filter(course =>
      course.name.toLowerCase().includes(this.searchTerm.toLowerCase())
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
}

