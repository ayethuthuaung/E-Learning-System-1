import { CourseService } from '../../services/course.service';
import { UserCourse } from './../../models/usercourse.model';
import { UserCourseService } from './../../services/user-course.service';
import { Component, OnInit , OnDestroy} from '@angular/core';
import { orderBy } from 'lodash';
declare var Swal: any;

@Component({
  selector: 'app-admin-student',
  templateUrl: './admin-student.component.html',
  styleUrls: ['./admin-student.component.css']
})
export class AdminStudentComponent implements OnInit, OnDestroy {
  activeTab: string = 'attendStudent';
  userCourses: UserCourse[] = [];
  paginatedUserCourses: UserCourse[] = [];
  searchTerm = '';
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;
  isSidebarOpen = true;
  loggedUser: any = '';
  userId: any;
  sortKey: string = '';
  sortDirection: string = 'asc';
  filterTerm = '';
  filterKey = '';

  private pollingInterval: any;
  private pollingIntervalMs: number = 3000; // Polling interval in milliseconds

  constructor(private userCourseService: UserCourseService,private courseService: CourseService) {}
  ngOnInit() {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      this.userId = this.loggedUser.id;
    }
    this.fetchAllStudentByCourse();
    this.startPolling(); // Start polling for updates
  }

  ngOnDestroy(): void {
    this.stopPolling(); // Clean up polling when component is destroyed
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  fetchAllStudentByCourse() {
    this.userCourseService.getAllUserCourses(this.userId).subscribe({
      next: (data) => {
        this.userCourses = orderBy(data, ['createdAt'], ['desc']);
      this.updatePaginatedStudentByCourses();
      this.totalPages = Math.ceil(this.userCourses.length / this.itemsPerPage);
    },
    error: (err) => console.error('Error fetching UserCourse:', err)
  });
}

  onSearchChange() {
    this.currentPage = 1;
    this.updatePaginatedStudentByCourses();
  }

  onSortChange(key: string, direction: string) {
    this.sortKey = key;
    this.sortDirection = direction;
    this.updatePaginatedStudentByCourses();
  }

  onFilterChange(event: { key: string, term: string }) {
    this.filterKey = event.key;
    this.filterTerm = event.term;
    this.updatePaginatedStudentByCourses();
  }

  updatePaginatedStudentByCourses() {
    let filteredStudentByCourses = this.userCourses.filter(userCourse =>
      userCourse.course?.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.department.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.team.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||

      userCourse.status.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.sortKey && (this.sortDirection === 'asc' || this.sortDirection === 'desc')) {
      filteredStudentByCourses = orderBy(filteredStudentByCourses, [this.sortKey], [this.sortDirection as 'asc' | 'desc']);
    }
    if (this.filterKey && this.filterTerm) {
      filteredStudentByCourses = filteredStudentByCourses.filter(userCourse =>
        (userCourse as any)[this.filterKey].toLowerCase().includes(this.filterTerm.toLowerCase())
      );
    }

    this.totalPages = Math.ceil(filteredStudentByCourses.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUserCourses = filteredStudentByCourses.slice(start, end);
  }

  firstPage() {
    this.currentPage = 1;
    this.updatePaginatedStudentByCourses();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedStudentByCourses();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedStudentByCourses();
    }
  }

  lastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedStudentByCourses();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedStudentByCourses();
    }
  }

  acceptStudent(userCourse: UserCourse) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to accept this student.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, accept!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.changeStatus(userCourse, 'Accept');
      }
    });
  }

  rejectStudent(userCourse: UserCourse) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to reject this student.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.changeStatus(userCourse, 'Reject');
      }
    });
  }

  changeStatus(userCourse: UserCourse, status: string) {
    this.userCourseService.changeStatus(userCourse.id, status).subscribe({
      next: () => {
        userCourse.status = status;
        this.updatePaginatedStudentByCourses();
        this.fetchAllStudentByCourse();
      },
      error: (err) => console.error('Error changing status:', err)
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  exportCoursesByInstructor(instructorId: number): void {
    this.courseService.exportCoursesByInstructor(instructorId).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `courses_${instructorId}.xls`;
      link.click();
    }, error => {
      console.error('Error exporting courses:', error);
    });
  }

  exportCoursesByInstructorToPdf(instructorId: number): void {
    this.courseService.exportCoursesByInstructorToPdf(instructorId).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `courses_${instructorId}.pdf`;
      link.click();
    }, error => {
      console.error('Error exporting courses to PDF:', error);
    });
  }

  private startPolling() {
    this.pollingInterval = setInterval(() => {
      this.fetchAllStudentByCourse(); // Poll for student course updates
    }, this.pollingIntervalMs);
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
}
