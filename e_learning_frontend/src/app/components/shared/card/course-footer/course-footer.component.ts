import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../../models/course.model';
import { UserCourseService } from '../../../services/user-course.service';
import { Role, User } from '../../../models/user.model';

import Swal from 'sweetalert2';
import { UserCourse } from '../../../models/usercourse.model';
import { log } from 'node:console';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-course-footer',
  templateUrl: './course-footer.component.html',
  styleUrls: ['./course-footer.component.css']
})
export class CourseFooterComponent implements OnInit, OnDestroy {

  @Input() course: Course | undefined;
  user: User | null = null;
  userId: number | undefined;
  isEnrolled: boolean = false; 
  isAccepted: boolean = false; 
  isPending: boolean = false;
  isRejected: boolean = false;
  userCourseId: number | undefined; 

  isOwner: boolean = false;

  roles: Role[] = [];

  private pollingInterval: any;
  private pollingIntervalMs: number = 3000; // Polling interval in milliseconds


  constructor(private userCourseService: UserCourseService, private router: Router) { }

  ngOnInit(): void {
    this.fetchUserData();
    this.isOwner = this.checkIsOwner();
    this.startPolling(); // Start polling when component is initialized
  }

  ngOnDestroy(): void {
    this.stopPolling(); // Clean up polling when component is destroyed
  }

  private startPolling() {
    this.pollingInterval = setInterval(() => {
      this.checkEnrollmentStatus(); // Poll by calling the checkEnrollmentStatus method
    }, this.pollingIntervalMs);
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
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
              console.log(this.user);
              
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
        
        (status: number) => {
          this.isPending = (status === 0); 
          this.isAccepted = (status === 1); 
          this.isRejected = (status === 2);
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

    // if (this.isEnrolled) {
    //   Swal.fire({
    //     title: 'Already Enrolled',
    //     text: 'You are already enrolled in this course. Please wait for the instructor to approve your enrollment.',
    //     icon: 'info',
    //     confirmButtonText: 'OK'
    //   });
    //   return;
    // }

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
    
    if (!this.course) {
      console.error('Course is undefined');
      return;
    }
    if (!this.isAccepted && !this.isOwner && !this.hasRole(2)) {

      Swal.fire({
        title: 'Enrollment Not Accepted',
        text: 'Your enrollment for this course is pending. Please wait for the instructor to approve.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    const encodedId = this.encodeId(this.course.id.toString());
    this.router.navigate(['/course-detail', encodedId]);
  }
  encodeId(id: string): string {
    const base64EncodedId = Base64.encode(id);
    const uuid = 'af782e56-8887-4130-9c0e-114ab93d7ebe'; // Static UUID-like string for format
    return `${uuid}-${base64EncodedId}`;
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
