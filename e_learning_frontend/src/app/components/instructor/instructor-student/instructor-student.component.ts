import { UserCourse } from './../../models/usercourse.model';
import { UserCourseService } from './../../services/user-course.service';
import { Component, OnInit } from '@angular/core';
import { orderBy } from 'lodash';
declare var Swal: any;

@Component({
  selector: 'app-instructor-student',
  templateUrl: './instructor-student.component.html',
  styleUrls: ['./instructor-student.component.css']
})
export class InstructorStudentComponent implements OnInit {
  userCourses: UserCourse[] = [];
  paginatedUserCourses: UserCourse[] = [];
  
  searchTerm = '';
  filterTerm = '';
  filterKey = '';

  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;
  isSidebarOpen = true;

  loggedUser: any = '';
  userId: any;

  sortKey: string = '';
sortDirection: string = 'asc';


  constructor(private userCourseService: UserCourseService) {}

  ngOnInit() {
 
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      console.log(this.loggedUser);

      // if (this.loggedUser) {
    
        this.userId = this.loggedUser.id;
       console.log(this.userId);
       
        
      // }
    }
    this.fetchAllStudentByCourse();
  }

  fetchAllStudentByCourse() {
    console.log(this.userId);
    console.log(this.loggedUser.id);
    this.userCourseService.getAllUserCourses(this.userId).subscribe({
      next: (data) => {
        this.userCourses = data.sort((a, b) => b.createdAt - a.createdAt);
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
    }).then((result: { isConfirmed: any; }) => {
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
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.changeStatus(userCourse, 'Reject');
      }
    });

  }

  changeStatus(userCourse: UserCourse, status: string) {
    this.userCourseService.changeStatus(userCourse.id, status).subscribe({
      next: () => {
        userCourse.status = status;
        console.log("Hi");
        
        this.updatePaginatedStudentByCourses();
        this.fetchAllStudentByCourse();
      },
      error: (err) => console.error('Error changing status:', err)
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
