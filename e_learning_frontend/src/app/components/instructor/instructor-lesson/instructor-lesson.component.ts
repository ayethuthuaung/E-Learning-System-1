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

  //Create Exam
  examId: number = 1; // Example exam ID
  examTitle: string='';
  examDescription: string= '';
  formDescription: string = 'Please fill out this form';

  questions: Question[] = [
    {
      text: 'Untitled Question',
      type: 'multiple-choice',
      options: [
        { label: 'Option 1', value: 'option1', isAnswered: false }
      ],
      marks:0
    }
  ];

  showResults: boolean = false; // Add this property to toggle result display



  addOption(questionIndex: number) {
    this.questions[questionIndex].options.push({
      label: `Option ${this.questions[questionIndex].options.length + 1}`,
      value: `option${this.questions[questionIndex].options.length + 1}`,
      isAnswered: false
    });
  }

  addQuestion() {
    this.questions.push({
      text: 'New Question',
      type: 'multiple-choice',
      options: [
        { label: 'Option 1', value: 'option1', isAnswered: false }
      ],
      marks:0,
      isNew: true // Mark this question as new
    });
  }

  deleteNewQuestion(questionIndex: number) {
    if (this.questions[questionIndex].isNew) {
      this.questions.splice(questionIndex, 1);
    }
  }

  selectOption(questionIndex: number, optionIndex: number) {
    const question = this.questions[questionIndex];
    question.options.forEach((option, idx) => {
      option.isAnswered = (idx === optionIndex);
    });
  }

  onSubmitExam(examForm: any) {
    const examCreationDto: ExamCreationDto = {
      lessonId: 1,

      title: this.examTitle,
      description: this.examDescription,
      questionList: this.questions.map(question => ({
        content: question.text,
        questionTypeId: question.type === 'multiple-choice' ? 1 : 2, // Map types to IDs
        answerList: question.options.map(option => ({
          answer: option.label,
          isAnswered: option.isAnswered
        } as AnswerOptionDTO)),
        marks: question.marks
      } as QuestionDto))
    };

    this.examService.createExam(examCreationDto)
      .subscribe(response => {
        console.log('Form submitted successfully', response);
        this.checkAnswers(response);
        this.showResults = true; // Show the results
      }, error => {
        console.error('Error submitting form', error);
      });
  }

  checkAnswers(response: any) {
    this.questions.forEach((question, qIndex) => {
      question.correctAnswer = response.questionList[qIndex].correctAnswer; // Assuming the correct answer is provided in the response
      question.options.forEach(option => {
        option.isCorrect = option.isAnswered && (option.label === question.correctAnswer);
      });
    });
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
