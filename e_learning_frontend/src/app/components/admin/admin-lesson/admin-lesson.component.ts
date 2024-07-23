import { Lesson } from './../../models/lesson.model';
import { ExamCreationDto } from './../../models/examCreationDto.model';
import { ExamService } from './../../services/exam.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Module } from '../../models/module.model';
import { LessonService } from '../../services/lesson.service';
import Swal from 'sweetalert2';
import { QuestionDto } from '../../models/question.model';
import { AnswerOptionDTO } from '../../models/questiondto.model';
import { Location } from '@angular/common';

interface Option {
  label: string;
  value: string;
  isAnswered: boolean;
  isCorrect?: boolean; // Add this property to track correctness
}

interface Question {
  text: string;
  type: string;
  marks: number;
  options: Option[];
  correctAnswer?: string; // Add this property to store the correct answer
  isNew?: boolean; // Add this property to track if the question is new
}

@Component({
  selector: 'app-admin-lesson',
  templateUrl: './admin-lesson.component.html',
  styleUrl: './admin-lesson.component.css'
})
export class AdminLessonComponent implements OnInit {  

  courseId: number = -1; // Initialize courseId with a default value
  lessonObj: Lesson | undefined;
  lesson: Lesson = {
    title: '',
    id: 0,
    courseId: 0,
    file: '',
    modules: [],
    fileType: '',
    examListDto: []
  };
  lessons: Lesson[] = [];
  modules: Module[] = [];
  nameDuplicateError = false;
  isSidebarOpen = true;
  activeTab: string = 'createLesson';
  examForm: any;

  currentLessonIndex: number = -1;
  isEditing: boolean = false;

  constructor(private route: ActivatedRoute,
    private lessonService: LessonService,
    private examService: ExamService,
    private location: Location,
    private router: Router,
    private cdr: ChangeDetectorRef

  ) { }


  ngOnInit(): void {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    console.log('Course ID Param:', courseIdParam);

    if (courseIdParam !== null) {
      this.courseId = +courseIdParam; // Convert courseIdParam to number if not null
    }
    this.getLessonsByCourseId();
  }


  validateCourseName(name: string) {

    this.nameDuplicateError = false;
  }

  editLesson(index: number) {
    this.currentLessonIndex = index;
    const lesson = this.lessons.find(lesson => lesson.id === index);
    console.log(lesson);
    console.log(this.lessons);
    if (lesson) {
      this.lesson.title = lesson.title;
      this.lesson.id = lesson.id;
    }
    this.isEditing = true;
    this.cdr.detectChanges(); // Ensure the view is updated before scrolling
    this.scrollToTop();
  }

  scrollToTop(): void {
    const formElement = document.querySelector('#lessonTop');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }


  onSubmit(lessonForm: any) {
    if (this.currentLessonIndex !== -1) {
      const updatedLesson = {
        title: this.lesson.title,
        courseId: this.courseId,
      };      
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this lesson?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel',
      }).then((result) => {
        if (result.isConfirmed) {  
          // const formData = new FormData();
          // formData.append('courseId', this.courseId.toString());
          // formData.append('title', this.lesson.title);     
          this.lessonService.updateLesson(this.lesson.id, updatedLesson).subscribe(
            updated => {
              Swal.fire('Updated!', 'The Lesson has been updated.', 'success');
              this.currentLessonIndex = -1;
              this.isEditing = false;
              lessonForm.resetForm();
              this.getLessonsByCourseId();
            },
            error => {
              console.error('Error updating lesson:', error);
              Swal.fire('Error!', 'Failed to update the lesson.', 'error');
            }
          );
        }
      });
    } else {
      if (lessonForm.valid) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to submit this lesson?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, submit!',
          cancelButtonText: 'No, cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('courseId', this.courseId.toString());
            formData.append('title', this.lesson.title);



            this.lessonService.createLesson(formData).subscribe(
              (createdLesson) => {
                console.log('Lesson Created:', createdLesson);
                Swal.fire('Success!', 'Lesson created successfully!', 'success');
                this.getLessonsByCourseId();
              },
              (error) => {
                console.error('Error creating lesson:', error);
                Swal.fire('Error!', 'Failed to create lesson.', 'error');

              }
            );
          }
        });
      }
    }
  }



    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }

    setActiveTab(tab: string) {
      this.activeTab = tab;
    }



    goBack() {
      this.location.back();
    }

    getLessonsByCourseId(): void {
      this.lessonService.getLessonsByCourseId(this.courseId, 1).subscribe(
        (data: Lesson[]) => {
          this.lessons = data;
        },
        error => {
          console.error('Error fetching courses', error);
        }
      );
    }

    navigateToLesson(lessonId: number) {
      console.log("Lesson Id :", lessonId);

      this.router.navigate([`../instructor/module-exam/${lessonId}`]);
    }

    deleteLesson(id: number): void {
      this.lessonService.deleteLesson(id).subscribe(
        () => {
          Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!'
          }).then((result) => {
            if (result.isConfirmed) {
              this.getLessonsByCourseId();
            }
          });
        },
        (error) => {
          console.error('Error deleting lesson', error);
          Swal.fire(
            'Error!',
            'An error occurred while deleting the lesson.',
            'error'
          );
        }
      );
    }
  }
  
