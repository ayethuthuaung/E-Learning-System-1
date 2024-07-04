import { Component, OnInit } from '@angular/core';
import { ChatRoomService } from '../services/chat-room.service';
import { AuthService } from '../auth/auth.service';
import { LessonService } from '../services/lesson.service';
import { Lesson } from '../models/lesson.model';
import { Course } from '../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';

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

  loggedUser: any = '';
  userId: any;
  instructorId: any;
  instructorName: string = ''; // Add instructorName property

  chatRoomId!: number;
  chatRoomVisible: boolean = false; // Add chatRoomVisible property

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatRoomService: ChatRoomService,
    private authService: AuthService,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = +params.get('courseId')!;
      this.course = history.state.course;
      console.log(`Course ID: ${this.courseId}`);
      console.log(`Course: ${JSON.stringify(this.course)}`);
      this.fetchLessons();
    });

    this.course = history.state.course;
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      console.log(this.loggedUser);

      if (this.loggedUser) {
        this.userId = this.loggedUser.id;
        this.instructorId = this.course?.user?.id;
        this.instructorName = this.course?.user?.name || ''; // Set instructorName
      }
    }

   
  }

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

