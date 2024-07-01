import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {

  course!: Course;

  constructor(private route: ActivatedRoute, private courseService: CourseService) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.courseService.getCourseById(id).subscribe({
      next: (data) => {
        this.course = data;
      },
      error: (e) => console.log(e)
    });
  }
}
