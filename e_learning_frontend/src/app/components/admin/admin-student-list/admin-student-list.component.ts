import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserCourseService } from './../../services/user-course.service';
import { CourseModuleService } from '../../services/course-module.service';
import { UserCourse } from './../../models/usercourse.model';
import { Course } from './../../models/course.model';
import { Subscription } from 'rxjs';
import { orderBy } from 'lodash';
import { log } from 'console';

@Component({
  selector: 'app-admin-student-list',
  templateUrl: './admin-student-list.component.html',
  styleUrls: ['./admin-student-list.component.css']
})
export class AdminStudentListComponent implements OnInit, OnDestroy {
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
  coursePercentages: { [courseId: number]: number} = {};
  enrolledCourses: Course[] = [];

  private userCoursesSubscription: Subscription = new Subscription();

  private pollingInterval: any;
  private pollingIntervalMs: number = 3000;

  constructor(
    private userCourseService: UserCourseService,
    private courseModuleService: CourseModuleService
  ) { }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  ngOnInit(): void {
    this.loadAcceptedUserCourses();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.userCoursesSubscription.unsubscribe();
    this.stopPolling(); // Clean up polling when component is destroyed
  }

  loadAcceptedUserCourses(): void {
    this.userCoursesSubscription.add(
      this.userCourseService.getAllAcceptedUserCourses().subscribe(
        (courses: UserCourse[]) => {
          this.userCourses = orderBy(
            courses.filter(course => course.status.toLowerCase() === 'accept'),
            ['createdAt'],
            ['desc']
          );
          this.updatePaginatedStudentByCourses();
          this.fetchCoursePercentages();  
          this.totalPages = Math.ceil(this.userCourses.length / this.itemsPerPage);
        },
        (error: any) => {
          console.error('Error loading accepted user courses:', error);
        }
      )
    );
  }
  

  onSearchChange() {
    this.currentPage = 1;
    this.updatePaginatedStudentByCourses();
  }

  updatePaginatedStudentByCourses() {
    let filteredStudentByCourses = this.userCourses.filter(userCourse =>
      userCourse.course?.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.department.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.team.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.user?.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      userCourse.progressOutput?.toLowerCase().includes(this.searchTerm.toLowerCase())  ||
      userCourse.certificateOutput?.toLowerCase().includes(this.searchTerm.toLowerCase()) || // search in completed field
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

  

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  fetchCoursePercentages(): void {
      this.enrolledCourses.forEach(course => {

      this.courseModuleService.getCompletionPercentage(this.loggedUser.id, course.id).subscribe({
        
        next: (percentage) => {
          console.log(`Fetched percentage for course ${course.id}: ${percentage}`);
          this.coursePercentages[course.id] = percentage;
        },
        error: (e) => console.log(e)
      });
    });
  }

  private startPolling() {
    this.pollingInterval = setInterval(() => {
      this.loadAcceptedUserCourses(); // Poll for student course updates
    }, this.pollingIntervalMs);
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

}
