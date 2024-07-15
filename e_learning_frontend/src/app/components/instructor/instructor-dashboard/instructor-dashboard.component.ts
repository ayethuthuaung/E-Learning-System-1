import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { UserCourseService } from '../../services/user-course.service';
import { UserCourse } from '../../models/usercourse.model';

interface Conversation {
  id: number;
  name: string;
  chatRoomId: number;
  photo:any;
  
}

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit {
  isSidebarOpen = true;
  chatRoomVisible: boolean = false;
 // createdCoursesCount: number = 0;
  acceptedCoursesCount: number = 0;
  studentCounts: { courseId: number, studentCount: number, acceptedCount: number }[] = [];
  

  constructor(private http: HttpClient,
     private router: Router,
     private authService: AuthService,
     private courseService: CourseService,
     private userCourseService: UserCourseService) {}

  ngOnInit(): void {
    this.loadInstructorCourseCounts();
    this.loadStudentCounts();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleChatRoom(): void {
    this.chatRoomVisible = !this.chatRoomVisible;
  }
  private loadInstructorCourseCounts(): void {
    const userId = this.authService.getLoggedInUserId();
    this.courseService.getInstructorCourses(userId).subscribe(
      (courses: Course[]) => {
       // this.createdCoursesCount = courses.length;
        this.acceptedCoursesCount = courses.filter(course => course.status === 'Accept').length;
      },
      (error) => {
        console.error('Error fetching instructor courses', error);
      }
    );
  }
  private loadStudentCounts(): void {
    const instructorId = this.authService.getLoggedInUserId();
    this.userCourseService.getAllUserCourses(instructorId).subscribe(
      (userCourses: UserCourse[]) => {
        const courseCounts = new Map<number, { studentCount: number, acceptedCount: number }>();

        userCourses.forEach(userCourse => {
          const courseId = userCourse.courseId;
          if (!courseCounts.has(courseId)) {
            courseCounts.set(courseId, { studentCount: 0, acceptedCount: 0 });
          }
          const counts = courseCounts.get(courseId)!;
          counts.studentCount++;
          if (userCourse.status === 'Accept') {
            counts.acceptedCount++;
          }
        });

        this.studentCounts = Array.from(courseCounts, ([courseId, counts]) => ({
          courseId,
          ...counts
        }));
      },
      (error) => {
        console.error('Error fetching student counts', error);
      }
    );
  }
}


  

