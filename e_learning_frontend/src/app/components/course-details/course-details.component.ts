import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { ChatRoomService } from '../services/chat-room.service';
import { AuthService } from '../auth/auth.service';
import { LessonService } from '../services/lesson.service';
import { Lesson } from '../models/lesson.model';
import { Course } from '../models/course.model';

import { ActivatedRoute, Router } from '@angular/router';
import { CourseModuleService } from '../services/course-module.service';
import { UserCourseModuleService } from '../services/usercoursemodule.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExamList } from '../models/examList.model';
import { ExamService } from '../services/exam.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {


  lessons: Lesson[] = [];
  isDropdownOpen: boolean[] = [];
  course!: Course;
  courseId: number | undefined;

  loggedUser: any = '';
  userId: any;
  instructorId: any;
  instructorName: string = ''; // Add instructorName property

  chatRoomId!: number;
  chatRoomVisible: boolean = false; // Add chatRoomVisible property
  lesson: Lesson | undefined;
  module: Course | undefined;
  exam: ExamList | undefined;

  isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatRoomService: ChatRoomService,
    private authService: AuthService,
    private lessonService: LessonService,

    private courseService: CourseService,
    private courseModuleService: CourseModuleService,
    private userCourseModuleService:UserCourseModuleService,
    private cdr: ChangeDetectorRef,
    private examService: ExamService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = +params.get('id')!;

      
      console.log(this.courseId);
      
      if (history.state.course) {
        this.course = history.state.course;
        console.log(`Course: ${JSON.stringify(this.course)}`);
        this.fetchLessons();
      } else {
        console.log('Course not found in state. Fetching from service.');
        this.courseService.getCourseById(this.courseId).subscribe(
          course => {
            this.course = course;
            console.log(this.course);
            console.log(this.course.userId);
            this.instructorId = this.course.userId;
            this.isOwner = this.checkIsOwner();

            console.log(`Fetched Course: ${JSON.stringify(this.course)}`);
            this.fetchLessons();
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

  checkIsOwner(): boolean{return this.userId===this.instructorId}

  toggleChatRoom(): void {
    if (!this.chatRoomVisible) {
      this.createChatRoom();
    }
    this.chatRoomVisible = !this.chatRoomVisible;
  }

  createChatRoom(): void {
    this.chatRoomService.create(this.instructorId, this.userId).subscribe(
      (response) => {
        console.log('Chat room created successfully', response);
        this.chatRoomId = response.chatRoomId;
      },
      (error) => {
        console.error('Error creating chat room:', error);
      }
    );
  }

  fetchLessons(): void {
    console.log('Fetching lessons for course ID:', this.courseId);
    if (this.courseId) {
      this.lessonService.getLessonsByCourseId(this.courseId,this.loggedUser.id).subscribe(
        (data) => {
          console.log('Fetched lessons:', data);

          this.lessons = data.map(lesson => ({
            ...lesson,
            modules: lesson.modules.sort((a, b) => a.id - b.id) // Sort modules by moduleId
          }));
  
          console.log(this.lessons);
          
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

  expandAllLessons(): void {
    const shouldExpand = this.isDropdownOpen.some(open => !open);
    this.isDropdownOpen.fill(shouldExpand);
  }


  viewVideoDetailClick(moduleId: number): void {
    if (this.course) {
      this.courseModuleService.getModuleById(moduleId).subscribe(
        (module) => {
          console.log("Module:", module);
          
          this.router.navigate([`/course-video-view/${module.id}`], { state: { module } });
        },
        (error) => {
          console.error('Error fetching course video view', error);
        }
      );
    }
}

viewQuestionFormClick(examId: number): void {
  // if (this.lesson?.examListDto.id) {
    this.examService.getExamById(examId).subscribe(
      (exam) => {
        console.log("exam:", exam);
        
        this.router.navigate([`/question-form/${examId}`], { state: { exam } });
      },
      (error) => {
        console.error('Error fetching course video view', error);
      }
    );
  // }
}

markAsDone(moduleId: number, lessonIndex: number): void {
  if (!this.userId || !this.courseId) {
    console.error('User ID or Course ID not available.');
    return;
  }

  const lesson = this.lessons[lessonIndex];
  const module = lesson.modules.find(m => m.id === moduleId);

  if (!module || module.done) {
    console.log(`Module ${moduleId} is already marked as done or not found.`);
    return;
  }

  this.userCourseModuleService.markModuleAsDone(this.userId, moduleId).subscribe(
    () => {
      module.done = true;
      localStorage.setItem(`module_${moduleId}_done`, 'true');
      this.cdr.detectChanges();
    },
    (error: HttpErrorResponse) => {
      console.error('Error marking module as done:', error);
      if (error.status === 404) {
        alert('UserCourseModule not found.');
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  );
}

goBack() {
  this.location.back();
}
}