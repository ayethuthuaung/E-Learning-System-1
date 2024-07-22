import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model'; // Ensure Course model includes instructorName
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { UserCourseService } from '../../services/user-course.service';
import { CourseModuleService } from '../../services/course-module.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  photo: any = '';
  name: string = 'Default Name';
  team: string = 'Default Team';
  department: string = 'Default Department';
  division: string = 'Default Division';
  loggedUser: any = '';
  id: number = 0;
  selectedFile: File | null = null;
  selectedCourse?: Course;
  enrolledCourses: Course[] = [];
  coursePercentages: { [courseId: number]: number } = {};

  constructor(
    private router: Router,
    private courseService: CourseService,
    private userService: UserService,
    private userCourseService: UserCourseService,
    private courseModuleService: CourseModuleService
  ) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      if (this.loggedUser) {
        this.name = this.loggedUser.name;
        this.team = this.loggedUser.team;
        this.department = this.loggedUser.department;
        this.division = this.loggedUser.division;
        this.id = this.loggedUser.id;
        this.fetchEnrolledCourses();
      }
    }
  }

  fetchEnrolledCourses(): void {
    if (this.id) {
      this.userCourseService.getCoursesByUserId(this.id).subscribe({
        next: (courses) => {
          this.enrolledCourses = courses;
          this.fetchCoursePercentages(); // Call this method after fetching courses
        },
        error: (e) => console.log(e)
      });
    }
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
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.updateProfile();
    }
  }

  updateProfile(): void {
    if (this.selectedFile && this.loggedUser) {
      this.userService.updateProfile(this.selectedFile, this.id).subscribe(
        (response: any) => {
          console.log('Profile updated successfully:', response);
          this.photo = response.url;
          this.loggedUser.photo = this.photo;
          localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
        },
        error => {
          console.error('Error updating profile:', error);
        }
      );
    }
  }

  downloadPhoto(): void {
    if (this.photo) {
      fetch(this.photo)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'profile-picture.jpg';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          alert('Your profile picture has been downloaded.');
        })
        .catch(error => console.error('Error downloading the photo:', error));
    }
  }

  viewCourse(course: Course): void {
    this.selectedCourse = course;
    if (this.selectedCourse) {
      this.router.navigate(['/course-detail', this.selectedCourse.id]);
    }
  }
}
