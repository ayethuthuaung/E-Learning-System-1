import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ExamCreationDto } from '../../models/examCreationDto.model';
import { ExamList } from '../../models/examList.model';
import { QuestionDto } from '../../models/question.model';
import { AnswerOptionDTO } from '../../models/questiondto.model';
import { CourseModuleService } from '../../services/course-module.service';
import { CourseService } from '../../services/course.service';
import { ExamService } from '../../services/exam.service';
import { LessonService } from '../../services/lesson.service';
import { Course } from '../../models/course.model';
import { TimerComponent } from '../../shared/timer/timer.component';
import { Lesson } from '../../models/lesson.model';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { Base64 } from 'js-base64';


interface Option {
  label: string;
  value: string;
  isAnswered: boolean;
  isCorrect?: boolean; 
}

interface Question {
  text: string;
  type: string;
  marks: number;
  options: Option[];
  correctAnswer?: string; 
  isNew?: boolean;
}

@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrl: './create-exam.component.css'
})
export class CreateExamComponent implements OnInit {
  activeTab: string = 'createExam';
  lessonId: any;
  lessons :Lesson[] =[];
  lesson!: { title: ''; };;
  courseId: number = 0;

  //Create Exam
 examId: number = 1; // Example exam ID
 examTitle: string='';
 examDescription: string= '';
 examDuration: string= '';
 examFinal: boolean | null = false;
 examPassScore: number = 0;
 formDescription: string = 'Please fill out this form';
 examList: ExamList[]=[];
 examForm: any;


 questions: Question[] = [
   {
     text: '',
     type: 'multiple-choice',
     options: [
       { label: 'Option 1', value: 'option1', isAnswered: false }
     ],
     marks:0
   }
 ];
 course: Course | undefined;


@ViewChild('formRef') formRef!: ElementRef;
@ViewChild(TimerComponent) timerComponent!: TimerComponent;

 constructor(
  private route: ActivatedRoute,
  private lessonService: LessonService,
  private examService: ExamService,
  private courseService: CourseService,
  private courseModuleService:CourseModuleService,
  private location: Location,
  private router:Router,
  private cdr: ChangeDetectorRef,
  private fb: FormBuilder
 ) {
  this.examForm = this.fb.group({
    questionMarks: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]]
  });
 }

 ngOnInit(): void {
  const lessonIdParam = this.route.snapshot.paramMap.get('lessonId');
  console.log('Lesson ID Param:', lessonIdParam);

  if (lessonIdParam !== null) {
    this.lessonId = this.decodeId(lessonIdParam);// Convert courseIdParam to number if not null
    this.loadExamByLessonId(this.lessonId);
     this.getCourseId(this.lessonId);
     
  }
  

}
decodeId(encodedId: string): number {
  try {
    // Extract the Base64 encoded ID part
    const parts = encodedId.split('-');
    if (parts.length !== 6) {
      throw new Error('Invalid encoded ID format');
    }
    const base64EncodedId = parts[5];
    // Decode the Base64 string
    const decodedString = Base64.decode(base64EncodedId);
    // Convert the decoded string to a number
    const decodedNumber = Number(decodedString);
    if (isNaN(decodedNumber)) {
      throw new Error('Decoded ID is not a valid number');
    }
    return decodedNumber;
  } catch (error) {
    console.error('Error decoding ID:', error);
    throw new Error('Invalid ID');
  }
}
 showResults: boolean = false;
 //Create Exam
 addOption(questionIndex: number) {
  this.questions[questionIndex].options.push({
    label: `Option ${this.questions[questionIndex].options.length + 1}`,
    value: `option${this.questions[questionIndex].options.length + 1}`,
    isAnswered: false
  });
}

handleOptionClick(questionIndex: number, optionIndex: number) {
  const question = this.questions[questionIndex];
  if (optionIndex === question.options.length - 1) {
    this.addOption(questionIndex);
  }
}

deleteOption(qIndex: number, oIndex: number) {
  event?.preventDefault();
  if (this.questions[qIndex].options.length > 1) {
    this.questions[qIndex].options.splice(oIndex, 1);
  }
}


addQuestion() {
  event?.preventDefault();
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
  event?.preventDefault();
  if (this.questions.length > 1) {
    this.questions.splice(questionIndex, 1);
  }
}

selectOption(questionIndex: number, optionIndex: number) {
  const question = this.questions[questionIndex];
  question.options.forEach((option, idx) => {
    option.isAnswered = (idx === optionIndex);
  });
}

loadExamByLessonId(lessonId: number) {
  this.examService.getExamByLessonId(lessonId).subscribe(
    exams => {
      this.examList = exams;
      
    },
    error => {
      console.error('Error fetching modules:', error);
      // Handle error
    }
  );
}

onSubmitExam(examForm: any) {
  if (examForm.invalid) {
    // Mark all controls as touched to trigger validation messages
    Object.keys(examForm.controls).forEach((control) => {
      examForm.controls[control].markAsTouched();
    });

   
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to submit this exam?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, submit!',
    cancelButtonText: 'No, cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      const examCreationDto: ExamCreationDto = {
        lessonId: this.lessonId,
        title: this.examTitle,
        description: this.examDescription,
        duration: this.examDuration,
        finalExam: this.examFinal,          
        passScore: this.examPassScore,
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

      this.examService.createExam(examCreationDto).subscribe(
        (response) => {
          console.log('Exam submitted successfully', response);
          Swal.fire('Success!', 'The exam has been submitted successfully.', 'success');
              this.examTitle= '';  
              this.examDescription='';
              this.examDuration = '';
              this.examFinal = null;
              this.examPassScore = 0;
               this.questions = [];
              this.questions = [
                {
                  text: '',
                  type: 'multiple-choice',
                  options: [
                    { label: 'Option 1', value: 'option1', isAnswered: false }
                  ],
                  marks:0
                }
              ];
              this.timerComponent.resetTimer(); // Reset the timer component

              this.loadExamByLessonId(this.lessonId);
               
        },
        (error) => {
          console.error('Error submitting exam', error);
          Swal.fire('Error!', 'There was an error submitting the exam.', 'error');
        }
      );
    } 
  });
}

deleteExam(examId: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this exam?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
    if (result.isConfirmed) {
      this.examService.deleteExam(examId).subscribe(
        () => {
          this.examList = this.examList.filter(exam => exam.id !== examId);
          Swal.fire('Deleted!', 'The exam has been deleted.', 'success');
        },
        error => {
          console.error('Error deleting exam:', error);
          Swal.fire('Error!', 'Failed to delete the exam.', 'error');
        }
      );
    }
  });
}

goBack() {
  this.location.back();
}

onDurationChange(duration: string) {
  console.log(duration);
  
  this.examDuration = duration;
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

getCourseId(lessonId: number): void {
  this.courseService.getCourseIdByLessonId(lessonId).subscribe(
    courseId => {
      console.log('Course ID:', courseId);
      this.courseId= courseId;
      this.getCourseById(this.courseId);
    },
    error => {
      console.error('Error fetching course ID:', error);
    }
  );
}

getCourseById(courseId: number): void {
  this.courseService.getCourseById(courseId).subscribe(
    (data: Course) => {
      this.course = data;
      console.log(this.course.name);
      
    },
    error => {
      console.error('Error fetching course', error);
    }
  );
}
}
