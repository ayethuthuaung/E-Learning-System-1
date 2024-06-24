import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  name: string = 'Default Name';
  team: string = 'Default Team';
  department: string = 'Default Department';
  division: string = 'Default Division';
  loggedUser: any = '';
  courses: any[] = [
    { title: 'Course 1', completion: 75, id: 1 },
    { title: 'Course 2', completion: 50, id: 2 },
    { title: 'Course 3', completion: 30, id: 3 },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      if (this.loggedUser) {
        this.name = this.loggedUser.name;
        this.team = this.loggedUser.team;
        this.department = this.loggedUser.department;
        this.division = this.loggedUser.division;
      }
    }
  }

  viewCourse(course: any): void {
    this.router.navigate(['/course', course.id]);
  }
}
