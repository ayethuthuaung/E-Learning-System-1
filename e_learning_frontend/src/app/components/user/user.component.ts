import { Component, OnInit } from '@angular/core';

interface Course {
  title: string;
  description: string;
  instructor: string;
}

interface User {
  name: string;
  email: string;
  profilePicture: string;
  courses: Course[];
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User;
  editableUser!: User;  // Use definite assignment assertion
  isEditing: boolean = false;

  constructor() {
    // Initialize user with sample data
    this.user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
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
    this.editableUser = { ...this.user };
    this.isEditing = true;
  }

  saveProfile(): void {
    this.user = { ...this.editableUser };
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }
}
