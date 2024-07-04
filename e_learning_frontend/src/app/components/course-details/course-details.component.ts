import { Component, OnInit } from '@angular/core';
import { LessonService } from '../services/lesson.service';
import { Lesson } from '../models/lesson.model';
import { Course } from '../models/course.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  lessons: Lesson[] = [];
  isDropdownOpen: boolean[] = [];
  course: Course | undefined;
  courseId: number | undefined;

  constructor(private lessonService: LessonService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = +params.get('courseId')!;
      this.course = history.state.course;
      console.log(`Course ID: ${this.courseId}`);
      console.log(`Course: ${JSON.stringify(this.course)}`);
      this.fetchLessons();
    });
  }

  fetchLessons(): void {
    console.log('Fetching lessons for course ID:', this.courseId);
    if (this.courseId) {
      this.lessonService.getLessonsByCourseId(this.courseId).subscribe(
        (data) => {
          console.log('Fetched lessons:', data);
          this.lessons = data;
          this.isDropdownOpen = new Array(this.lessons.length).fill(false);
        },
        (error) => {
          console.error('Error fetching lessons:', error);
        }
      );
    }
  }

  toggleDropdown(index: number) {
    this.isDropdownOpen[index] = !this.isDropdownOpen[index];
  }
}
