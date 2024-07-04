import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../../models/course.model';

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

  constructor() {}

  ngOnInit(): void {}

 

}
