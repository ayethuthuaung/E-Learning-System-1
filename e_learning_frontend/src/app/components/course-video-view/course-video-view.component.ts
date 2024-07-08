import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../services/lesson.service';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';
import { Lesson } from '../models/lesson.model';
import { Module } from '../models/module.model';

@Component({
  selector: 'app-course-video-view',
  templateUrl: './course-video-view.component.html',
  styleUrl: './course-video-view.component.css'
})
export class CourseVideoViewComponent implements OnInit{
  courseId: number | undefined;
  course: Course | undefined;
  moduleId: number | undefined;
  module: Module | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,

    private lessonService: LessonService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      
      this.moduleId = +params.get('id')!;

      
      
      this.module = history.state.module;
      console.log(`Module ID: ${this.moduleId}`);
      console.log(`Module: ${JSON.stringify(this.module)}`);
    });

}
}
