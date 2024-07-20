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
  name: string = '';
  team: string = '';
  department: string = '';
  division: string = '';
  loggedUser: any = '';
  id: number = 0;
  roles: string[] = [];
  selectedFile: File | null = null;

  courseNames: string[] = [];
 
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
      console.log(this.loggedUser);

      if (this.loggedUser) {
        this.photo = this.loggedUser.photo;
        this.name = this.loggedUser.name;
        this.team = this.loggedUser.team;
        this.department = this.loggedUser.department;
        this.division = this.loggedUser.division;
        this.id = this.loggedUser.id;
        this.roles = this.loggedUser.roles.map((role: any) => role.name);
        console.log(this.id);
          this.fetchEnrolledCourses();
      }
    }
  }

  onFileSelected(event: any): void {
    console.log("Hi");

    const file: File = event.target.files[0];
    console.log(file);

    if (file) {
      console.log("Hi");
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
          // Handle error response
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


  fetchEnrolledCourses(): void {
    if (this.id) {
      this.userCourseService.getCoursesByUserId(this.id).subscribe({
        next: (courses) => {
          this.enrolledCourses = courses;
          this.fetchCourseNames(); // Call this method after fetching courses
          this.fetchCoursePercentages(); // Call this method after fetching courses
        },
        error: (e) => console.log(e)
      });
    }
  }
  
  fetchCourseNames(): void {
    this.enrolledCourses.forEach(course => {
      this.courseService.getCourseById(course.id).subscribe({
        next: (fetchedCourse) => {
          course.name = fetchedCourse.name; // Assuming fetchedCourse contains the name property
        },
        error: (e) => console.log(`Error fetching course ${course.id} name:`, e)
      });
    });
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
  viewCourse(course: Course): void {
    this.selectedCourse = course;
    if (this.selectedCourse) {
      this.router.navigate(['/course-detail', this.selectedCourse.id]);
    }
  }
  goBack(): void {
    // Example of navigating back to the previous location
    window.history.back();
  }
 
}