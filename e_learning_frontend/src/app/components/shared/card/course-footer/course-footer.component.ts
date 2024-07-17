import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../../models/course.model';
import { UserCourseService } from '../../../services/user-course.service';
import { Role, User } from '../../../models/user.model';

import Swal from 'sweetalert2';
import { UserCourse } from '../../../models/usercourse.model';
import { log } from 'node:console';

@Component({
  selector: 'app-course-footer',
  templateUrl: './course-footer.component.html',
  styleUrls: ['./course-footer.component.css']
})
export class CourseFooterComponent implements OnInit {

  @Input() course: Course | undefined;
  user: User | null = null;
  userId: number | undefined;
  isEnrolled: boolean = false; 
  isAccepted: boolean = false; 
  userCourseId: number | undefined; 

  isOwner: boolean = false;

  roles: Role[] = [];


  constructor(private userCourseService: UserCourseService, private router: Router) { }

  ngOnInit(): void {
    this.fetchUserData();
    this.isOwner = this.checkIsOwner();
  }

  checkIsOwner(): boolean{return this.userId===this.course?.user?.id}

  fetchUserData(): void {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      const loggedUser = JSON.parse(storedUser);
      if (loggedUser) {
        this.userId = loggedUser.id;
        this.roles = loggedUser.roles;
         // Access role IDs
         if (this.roles.length > 0) {
          this.roles.forEach(role => {
            console.log("courseFooter: ",role.id); // Print each role ID
          });
        }

        this.userCourseService.getUserById(this.userId!).subscribe(
          (user: User | null) => {
            if (user) {
              this.user = user;
              this.checkEnrollmentStatus(); 
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

  checkEnrollmentStatus(): void {
    if (this.course && this.userId) {
      this.userCourseService.checkEnrollment(this.userId, this.course.id).subscribe(
        (isEnrolled: boolean) => {
          this.isEnrolled = isEnrolled;
          if (isEnrolled) {
            this.checkEnrollmentAcceptance(); 
          }
        },
        (error) => {
          console.error('Error checking enrollment status', error);
        }
      );
    }
  }

  checkEnrollmentAcceptance(): void {
    if (this.course && this.userId) {
      this.userCourseService.checkEnrollmentAcceptance(this.userId, this.course.id).subscribe(
        
        (isAccepted: boolean) => {
          this.isAccepted = isAccepted;
          console.log(this.isAccepted);

        },
        (error) => {
          console.error('Error checking enrollment acceptance', error);
        }
      );
    }
  }

  enrollUser(): void {
    if (!this.course || !this.user) {
      console.error('Course or user is undefined');
      return;
    }

    if (this.isEnrolled) {
      Swal.fire({
        title: 'Already Enrolled',
        text: 'You are already enrolled in this course. Please wait for the instructor to approve your enrollment.',
        icon: 'info',
        confirmButtonText: 'OK'
      });
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
            //Swal.fire('Enrolled!', `You have successfully enrolled in ${courseName}.`, 'success');
            this.isEnrolled = true;
            this.checkEnrollmentAcceptance(); 
          },
          (error) => {
            console.error('Error enrolling in course', error);
            Swal.fire('Error', 'There was an issue enrolling in the course. Please try again.', 'error');
          }
        );
      }
    });
  }

  goToCourseDetails(): void {
    console.log("Hi");
    
    if (!this.course) {
      console.log("Hi");

      console.error('Course is undefined');
      return;
    }

    if (!this.isAccepted && !this.isOwner ) {
      console.log("Hi");

      Swal.fire({
        title: 'Enrollment Not Accepted',
        text: 'Your enrollment for this course is pending. Please wait for the instructor to approve.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.router.navigate(['/course-detail', this.course.id]);
  }

  changeUserCourseStatus(status: string): void {
    if (this.userCourseId) { // Ensure userCourseId is defined
      this.userCourseService.changeStatus(this.userCourseId, status).subscribe(
        () => {
          Swal.fire('Status Changed!', `The status has been changed to ${status}.`, 'success');
        },
        (error) => {
          console.error('Error changing status', error);
          Swal.fire('Error', 'There was an issue changing the status. Please try again.', 'error');
        }
      );
    } else {
      console.error('userCourseId is undefined');
    }
  }

  hasRole(roleId: number): boolean {
    return this.roles.some(role => role.id === roleId);
  }
}
