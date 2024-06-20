import { Component, OnInit,Input } from '@angular/core';
import { Courses } from '../../../models/courses.model';


@Component({
  selector: 'app-course-footer',
  templateUrl: './course-footer.component.html',
  styleUrls: ['./course-footer.component.css']
})
export class CourseFooterComponent implements OnInit {

  @Input('course')
  course!:Courses;

  constructor() { }

  ngOnInit(): void {
  }

}
