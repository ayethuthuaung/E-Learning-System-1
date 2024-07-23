import { Component, OnInit } from '@angular/core';
import { UserCourseService } from '../../services/user-course.service';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  showNotificationsPage: boolean = false;
  isSidebarOpen = true;
  totalStudentCount: number = 0;
  studentCounts: { courseName: string, acceptedCount: number }[] = [];
  acceptedCourseCount: number = 0;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleNotificationsPage() {
    this.showNotificationsPage = !this.showNotificationsPage;
  }

  constructor(private userCourseService: UserCourseService,private courseService:CourseService) {}

  ngOnInit(): void {

    this.fetchAcceptedCounts();
    this.fetchAcceptedCourses();
  }
    fetchAcceptedCounts() {
      this.userCourseService.getAcceptedStudentCounts().subscribe(counts => {
        this.studentCounts = Object.entries(counts).map(([courseName, acceptedCount]) => ({ courseName, acceptedCount }));
        this.totalStudentCount = this.studentCounts.reduce((sum, count) => sum + count.acceptedCount, 0);
      });
    }
    fetchAcceptedCourses() {
      this.courseService.getAllCourses('Accept').subscribe(courses => {
        this.acceptedCourseCount = courses.length;
      });
    }

    
  }
 


