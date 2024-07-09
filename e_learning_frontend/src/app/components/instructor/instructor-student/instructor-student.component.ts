import { UserCourse } from './../../models/usercourse.model';
import { UserCourseService } from './../../services/user-course.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructor-student',
  templateUrl: './instructor-student.component.html',
  styleUrls: ['./instructor-student.component.css']
})
export class InstructorStudentComponent implements OnInit {
  userCourses: UserCourse[] = [];
  paginatedUserCourses: UserCourse[] = [];
  
  searchTerm = '';

  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;
  isSidebarOpen = true;

  constructor(private userCourseService: UserCourseService) {}

  ngOnInit() {
    this.fetchAllStudentByCourse();
  }

  fetchAllStudentByCourse() {
    this.userCourseService.getAllUserCourses().subscribe({
      next: (data) => {
        this.userCourses = data;
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

  updatePaginatedStudentByCourses() {
    const filteredStudentByCourses = this.userCourses.filter(userCourse =>
      userCourse.course?.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.department.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.team.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.status.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

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
    userCourse.status= 'accept';
    //this.updateCourseStatus(course);
  }

  rejectStudent(userCourse: UserCourse) {
    userCourse.status = 'reject';
    // this.updateCourseStatus(course);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
