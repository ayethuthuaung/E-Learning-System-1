import { Component, OnInit } from '@angular/core';

interface Course {
  title: string;
  description: string;
  instructor: string;
}

interface Admin {
  name: string;
  email: string;
  profilePicture: string;
  courses: Course[];
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  admin: Admin;
  editableAdmin!: Admin;  // Use definite assignment assertion
  isEditing: boolean = false;

  constructor() {
    // Initialize admin with sample data
    this.admin = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      profilePicture: 'https://via.placeholder.com/150',
      courses: [
        {
          title: 'Introduction to Angular',
          description: 'Learn the basics of Angular framework.',
          instructor: 'Jane Smith'
        },
        {
          title: 'Advanced Angular Techniques',
          description: 'Dive deeper into Angular features and optimizations.',
          instructor: 'Mark Johnson'
        }
      ]
    };
  }

  ngOnInit(): void {
    // Additional initialization logic can be added here
  }

  editProfile(): void {
    this.editableAdmin = { ...this.admin };
    this.isEditing = true;
  }

  saveProfile(): void {
    this.admin = { ...this.editableAdmin };
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  addCourse(): void {
    // Logic to add a new course
    const newCourse: Course = {
      title: 'New Course Title',
      description: 'Course description goes here.',
      instructor: 'New Instructor'
    };
    this.admin.courses.push(newCourse);
  }

  editCourse(course: Course): void {
    // Logic to edit an existing course
    console.log('Editing course:', course);
  }

  deleteCourse(course: Course): void {
    // Logic to delete a course
    this.admin.courses = this.admin.courses.filter(c => c !== course);
  }
}
