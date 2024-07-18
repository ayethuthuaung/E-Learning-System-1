import { Lesson } from './../../models/lesson.model';
import { ExamCreationDto } from './../../models/examCreationDto.model';
import { ExamService } from './../../services/exam.service';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-instructor-lesson',
  templateUrl: './instructor-lesson.component.html',
  styleUrls: ['./instructor-lesson.component.css']
})
export class InstructorLessonComponent implements OnInit {  

  courseId: number = -1; // Initialize courseId with a default value
  course = { name: '' };
  lessons :Lesson[] =[];
  modules: Module[] = [];
  nameDuplicateError = false;
  isSidebarOpen = true;
  activeTab: string = 'createLesson';
examForm: any;

  constructor(private route: ActivatedRoute,
     private lessonService: LessonService,
     private examService: ExamService,
     private location: Location,
     private router:Router
    ) {}


  ngOnInit(): void {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    console.log('Course ID Param:', courseIdParam);

    if (courseIdParam !== null) {
      this.courseId = +courseIdParam; // Convert courseIdParam to number if not null
    }
    this.getLessonsByCourseId();
  }

  addModule() {
    this.modules.push({ id:1,name: '', file:'',fileInput: null, fileType:'' ,done: true}); // Initialize File as null
    console.log(this.modules);
    
  }

  validateCourseName(name: string) {
   
    this.nameDuplicateError = false; 
  }

  removeModule(index: number) {
    this.modules.splice(index, 1);
    console.log(this.modules);
    
  }


  onSubmit(courseForm: any) {
    if (courseForm.valid) {
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
        formData.append('title', this.course.name);

      

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
    }else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'Lesson creation cancelled.', 'info');
    }
  });
}
}

 
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onFileSelected(event: any, index: number) {
    const file: File = event.target.files[0];
    this.modules[index].fileInput = file;
  }

  
  goBack() {
    this.location.back();
  }

  getLessonsByCourseId(): void {
    this.lessonService.getLessonsByCourseId(this.courseId).subscribe(
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
}
