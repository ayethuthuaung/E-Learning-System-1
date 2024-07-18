import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  acceptedCourseCount: number = 0;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.fetchAcceptedCourseCount();
  }

  fetchAcceptedCourseCount() {
    this.courseService.getAllCourses('accept')
      .subscribe(courses => {
        this.acceptedCourseCount = courses.length;
      });
  }
}
