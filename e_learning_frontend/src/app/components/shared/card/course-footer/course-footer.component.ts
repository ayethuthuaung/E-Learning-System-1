import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../../models/course.model';
import { UserCourseService } from '../../../services/user-course.service';
import { User } from '../../../models/user.model';
import { UserCourse } from '../../../models/usercourse.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-footer',
  templateUrl: './course-footer.component.html',
  styleUrls: ['./course-footer.component.css']
})
export class CourseFooterComponent implements OnInit {

  @Input() course: Course | undefined;
  user: User | null = null;
  loggedUser: User | null = null;
  userId: number | undefined;

  constructor(private userCourseService: UserCourseService, private router: Router) { }

  ngOnInit(): void {
    
    this.enrollUser();

  
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);

      if (this.loggedUser) {
        this.userId = this.loggedUser.id;
 
        this.userCourseService.getUserById(this.userId).subscribe(
          (user: User | null) => {
            if (user) {
              this.user = user;
              this.loggedUser = user;
            } else {
              console.error('User details not found or invalid');
            }
          },
          (error) => {
            console.error('Error fetching user details', error);
          }
        );
      }
    } else {
      console.error('Logged user not found in localStorage');
    }

  
  }

  enrollUser(): void {
    if (!this.course || !this.user) {
      console.error('Course or user is undefined');
      return;
    }

    const courseName = this.course.name ?? 'this course';

    Swal.fire({
      title: `Are you sure you want to enroll in ${courseName}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning'
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {
        this.userCourseService.enrollUserInCourse(this.userId!, this.course!.id).subscribe(
          (userCourse: UserCourse) => {
            Swal.fire('Enrolled!', `You have successfully enrolled in ${courseName}.`, 'success');
          },
          (error) => {
            console.error('Error enrolling in course', error);
            Swal.fire('Error', 'There was an issue enrolling in the course. Please try again.', 'error');
          }
        );
      }
    });
  }

}
