import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
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
import { UnreadMessageService } from '../services/unread-message.service';
import { WebSocketService } from '../services/websocket.service';
import { Role } from '../models/user.model';
import Swal from 'sweetalert2';


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
  roles: Role[] = [];

  isOwner: boolean = false;

  isFinalExam: boolean = false;
  filteredExamList: ExamList[] = [];
  showFinalExam: boolean = false;
  expandAllText: string = 'Expand All';
  unreadCount: number = 0;

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
    private location: Location,
    private webSocketService: WebSocketService,
    private unreadMessageService: UnreadMessageService,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.unreadMessageService.unreadMessageCount$.subscribe(count => {
      this.unreadCount = count;
    });
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
        this.roles = this.loggedUser.roles;
        // this.instructorId = this.course.userId;
        // console.log(this.instructorId);
        
        this.instructorName = this.course?.user?.name || ''; // Set instructorName
       
      }
    }
  }
 
  checkIsOwner(): boolean{return this.userId===this.instructorId}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const chatRoom = this.elRef.nativeElement.querySelector('app-chat');
    
    if (this.chatRoomVisible && chatRoom && !chatRoom.contains(target)) {
      this.toggleChatRoom(); // Close the chat room if click is outside
    }
  }

 
  toggleChatRoom(): void {
    if (!this.chatRoomVisible) {
      if (!this.chatRoomId) {
        this.createChatRoom();
      }
    }
    this.chatRoomVisible = !this.chatRoomVisible;

    if (this.chatRoomVisible) {
      if (this.chatRoomId) {
        this.webSocketService.updateAllMessagesReadStatus(this.chatRoomId).subscribe(
          () => {
            this.unreadCount = 0; // Fetch unread count when chat room is opened
          },
          (error) => {
            console.error('Error marking all messages as read:', error);
          }
        );
      }
    }
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
  
          this.filteredExamList = []; // Clear filteredExamList at the start

        this.lessons.forEach(lesson => {
          this.showFinalExam = lesson.userComplete || this.isOwner || this.hasRole(2);
          console.log(this.showFinalExam);

          if (this.showFinalExam) {
            lesson.examListDto.forEach(exam => {
              if (exam.finalExam) {
                this.filteredExamList.push(exam); // Use push to add exams to the array
              }
            });
          }
            lesson.examListDto = lesson.examListDto.filter(exam => !exam.finalExam);

          });
  
        console.log(this.filteredExamList);
          
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
    this.expandAllText = shouldExpand ? 'Close All' : 'Expand All';
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
  this.examService.getExamById(examId).subscribe(
    (exam) => {
      
      const duration = exam.duration; // e.g., '01:30:00'
      

      // Format the duration (optional)
      const formattedDuration = this.formatDuration(duration);

      Swal.fire({
        title: 'Are you sure?',
        html: `
        <div>
          
          <span>You want to go to the question form.<br><br>
          <i class="fa-regular fa-clock" style="font-size: 24px;"></i>
          Time Allowed: ${formattedDuration}</span>
        </div>
      `,
        iconHtml: '<i class="fa fa-clipboard-list" style="font-size: 50px; color: #3085d6;"></i>',
        showCancelButton: true,
        confirmButtonColor: '#003366',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Go To Form',
        cancelButtonText: 'Cancel  '
      }).then((result) => {
        if (result.isConfirmed) {
          // If confirmed, navigate to the question form
          if(this.isOwner|| this.hasRole(2))
            this.router.navigate([`/view-question-form/${examId}`], { state: { exam } });
          else
            this.router.navigate([`/question-form/${examId}`], { state: { exam } });        }
      });
    },
    (error) => {
      console.error('Error fetching exam:', error);
    }
  );
}

formatDuration(duration: string): string {
  const parts = duration.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);
  return `${hours} h ${minutes} m ${seconds} s`;
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

      // Check if all modules are done
      console.log(this.lessons);
      
      const allModulesDone = lesson.modules.every(m => m.done);
      if (allModulesDone) {
        console.log("Hi");
        
        this.showFinalExam = true;
        this.filteredExamList = lesson.examListDto.filter(exam => exam.finalExam);
        Swal.fire({
          title: 'All modules are done!',
          text: 'You can now take the final exam.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            // Refresh the page when OK button is clicked
            window.location.reload();
          }
        });
      }else{

        console.log("Hello");

      }

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

hasRole(roleId: number): boolean {
  return this.roles.some(role => role.id === roleId);
}

goBack() {
  this.location.back();
}


}