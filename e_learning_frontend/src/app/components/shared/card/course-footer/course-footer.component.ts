import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-course-footer',
  templateUrl: './course-footer.component.html',
  styleUrls: ['./course-footer.component.css']
})
export class CourseFooterComponent implements OnInit {

  @Input() course: Course | undefined;
  @Output() enrolledClick = new EventEmitter<Course>();

  constructor(private courseService: CourseService, private router: Router) { }

  ngOnInit(): void {
  }

  viewDetailClick(): void {
    if (this.course) {
      this.courseService.getCourseById(this.course.id).subscribe(
        (course) => {
          this.router.navigate([`/course-detail/${course.id}`], { state: { course } });
        },
        (error) => {
          console.error('Error fetching course details', error);
        }
      );
    }
  }
}
