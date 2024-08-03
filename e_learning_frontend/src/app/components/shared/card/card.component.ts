import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../../models/course.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() input!: Course;
  @Output() enrolledClick = new EventEmitter<Course>();
  course: Course|undefined;
  router: any;
  role: string | undefined;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.input.user) {
      this.fetchUserRole(this.input.user.id);
    }
  }

  fetchUserRole(userId: number): void {
    this.userService.getUsersById(userId).subscribe(user => {
      if (user.roles.length > 0) {
        this.role = user.roles[0].name; // Assuming you want to show the first role
      }
    });
  }
    
  }
  
  



