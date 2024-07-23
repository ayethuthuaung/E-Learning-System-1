// import { Component, OnInit } from '@angular/core';
// import { CourseService } from '../../services/course.service';
// import { Course } from '../../models/course.model';

// declare var Swal: any;

// @Component({
//   selector: 'app-admin-course-list',
//   templateUrl: './admin-course-list.component.html',
//   styleUrls: ['./admin-course-list.component.css']
// })
// export class AdminCourseListComponent implements OnInit {
//   courses: Course[] = [];
//   paginatedCourses: Course[] = [];
//   searchTerm = '';
//   statusFilter = 'all';
//   selectedCourse: Course | null = null;

//   itemsPerPage = 10;
//   currentPage = 1;
//   totalPages = 0;

//   constructor(private courseService: CourseService) {}

//   ngOnInit() {
//     this.fetchCourses();
//   }

//   fetchCourses() {
//     this.courseService.getAllCourses(this.statusFilter).subscribe({
//       next: (data) => {
//         this.courses = data;
//         this.updatePaginatedCourses();
//         this.totalPages = Math.ceil(this.courses.length / this.itemsPerPage);
//       },
//       error: (err) => {
//         console.error(err);
//       }
//     });
//   }

//   onSearchChange() {
//     this.updatePaginatedCourses();
//   }

//   onStatusChange() {
//     this.fetchCourses();
//   }

//   acceptCourse(course: Course) {
//     course.status = 'Accept';
//     this.courseService.changeStatus(course.id, 'Accept').subscribe({
//       next: () => {
//         Swal.fire('Success!', 'Course accepted successfully!', 'success');
//         this.updatePaginatedCourses();
//       },
//       error: (err) => {
//         console.error(err);
//       }
//     });
//   }

//   rejectCourse(course: Course) {
//     course.status = 'Reject';
//     this.courseService.changeStatus(course.id, 'Reject').subscribe({
//       next: () => {
//         Swal.fire('Success!', 'Course rejected successfully!', 'success');
//         this.updatePaginatedCourses();
//       },
//       error: (err) => {
//         console.error(err);
//       }
//     });
//   }

//   openModal(course: Course) {
//     // You can use a service or other logic to open the modal
//     this.selectedCourse = course;
//     const modal = document.getElementById('fullScreenModal');
//     if (modal) {
//       modal.style.display = 'block';
//     }
//   }

//   closeModal() {
//     this.selectedCourse = null;
//     const modal = document.getElementById('fullScreenModal');
//     if (modal) {
//       modal.style.display = 'none';
//     }
//   }

//   updatePaginatedCourses() {
//     const filteredCourses = this.courses.filter(course =>
//       course.name.toLowerCase().includes(this.searchTerm.toLowerCase())
//     );

//     this.totalPages = Math.ceil(filteredCourses.length / this.itemsPerPage);
//     const start = (this.currentPage - 1) * this.itemsPerPage;
//     const end = start + this.itemsPerPage;
//     this.paginatedCourses = filteredCourses.slice(start, end);
//   }

//   firstPage() {
//     this.currentPage = 1;
//     this.updatePaginatedCourses();
//   }

//   previousPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.updatePaginatedCourses();
//     }
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//       this.updatePaginatedCourses();
//     }
//   }

//   lastPage() {
//     this.currentPage = this.totalPages;
//     this.updatePaginatedCourses();
//   }

//   goToPage(page: number) {
//     if (page >= 1 && page <= this.totalPages) {
//       this.currentPage = page;
//       this.updatePaginatedCourses();
//     }
//   }
// }



import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { WebSocketService } from '../../services/websocket.service';
import { orderBy } from 'lodash';

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
  activeTab: string = 'courseList';

  sortKey: string = '';
  sortDirection: string = 'asc';
  filterTerm = '';
  filterKey = '';

  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;

  constructor(
    private courseService: CourseService,
    private webSocketService:WebSocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchCourses();
  }

  fetchCourses() {
    this.courseService.getAllCourses(this.statusFilter).subscribe({
      next: (data) => {
        this.courses = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.updatePaginatedCourses();
        this.totalPages = Math.ceil(this.courses.length / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      }
    });
  }

  onSearchChange() {
    this.currentPage = 1;
    this.updatePaginatedCourses();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.fetchCourses();
  }

  acceptCourse(course: Course) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to accept this course.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, accept!'
    }).then((result) => {
      if (result.isConfirmed) {
        course.status = 'Accept';
        this.courseService.changeStatus(course.id, 'Accept').subscribe({
          next: () => {
            this.updatePaginatedCourses();
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    });
  }

  rejectCourse(course: Course) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to reject this course.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject!'
    }).then((result) => {
      if (result.isConfirmed) {
        course.status = 'Reject';
      this.courseService.changeStatus(course.id, 'Reject').subscribe({
      next: () => {
        this.updatePaginatedCourses();
      },
      error: (err) => {
        console.error(err);
      }
    });

      }
    });
  }
 
  openModal(course: Course) {
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

  onSortChange(key: string, direction: string) {
    this.sortKey = key;
    this.sortDirection = direction;
    this.updatePaginatedCourses();
  }

  onFilterChange(event: { key: string, term: string }) {
    this.filterKey = event.key;
    this.filterTerm = event.term;
    this.updatePaginatedCourses();
  }

  updatePaginatedCourses() {
    let filteredCourses = this.courses.filter(course =>
      course.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.duration.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (course.user && course.user.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );

    if (this.sortKey && (this.sortDirection === 'asc' || this.sortDirection === 'desc')) {
      filteredCourses = orderBy(filteredCourses, [this.sortKey], [this.sortDirection as 'asc' | 'desc']);
    }
    if (this.filterKey && this.filterTerm) {
      filteredCourses = filteredCourses.filter(course =>
        (course as any)[this.filterKey].toLowerCase().includes(this.filterTerm.toLowerCase())
      );
    }


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
  exportAllCoursesPDF() {
    this.courseService.exportAllCoursesPDF().subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'all_courses.pdf';
      link.click();
    });
  }
  exportAllCourses() {
    this.courseService.exportAllCourses().subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'all_courses.xls';
      link.click();
    });
  }
}

