import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { UserCourseService } from '../../services/user-course.service';

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

  constructor(
    private router: Router,
    private courseService: CourseService,
    private userService: UserService,
    private userCourseService: UserCourseService
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
        console.log(this.id);
        this.fetchEnrolledCourses();
      }
    }
  }

  fetchEnrolledCourses(): void {
    if (this.id) {
      this.userCourseService.getCoursesByUserId(this.id).subscribe({
        next: (courses) => {
          this.enrolledCourses = courses;
        },
        error: (e) => console.log(e)
      });
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

  viewCourse(course: Course): void {
    this.courseService.getCourseById(course.id).subscribe({
      next: (data) => {
        this.selectedCourse = data;
      },
      error: (e) => console.log(e)
    });
  }
}
