import { Component, OnInit } from '@angular/core';
import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-question-form',
  templateUrl: './student-question-form.component.html',
  styleUrl: './student-question-form.component.css'
})
export class StudentQuestionFormComponent implements OnInit{
  course!: Course;
  courseId: number | undefined;
  loggedUser: any = '';
  userId: any;
  instructorId: any;
  instructorName: string = ''; 

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: { get: (arg0: string) => any; }) => {
      this.courseId = +params.get('id')!;

      
      console.log(this.courseId);
      
      if (history.state.course) {
        this.course = history.state.course;
        console.log(`Course: ${JSON.stringify(this.course)}`);
      } else {
        console.log('Course not found in state. Fetching from service.');
        this.courseService.getCourseById(this.courseId).subscribe(
          course => {
            this.course = course;
          },
          error => {
            console.error('Error fetching course:', error);
          }
        );
      }
    });
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      console.log(this.loggedUser);

      if (this.loggedUser) {
        this.userId = this.loggedUser.id;
        // this.instructorId = this.course.userId;
        // console.log(this.instructorId);
        
        this.instructorName = this.course?.user?.name || ''; // Set instructorName
      }
    }    
  }


}
