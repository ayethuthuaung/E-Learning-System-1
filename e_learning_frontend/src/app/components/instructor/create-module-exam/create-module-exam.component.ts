import { CourseModuleService } from '../../services/course-module.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../../services/lesson.service';
import { ExamService } from '../../services/exam.service';
import { Lesson } from '../../models/lesson.model';
import { Module } from '../../models/module.model';
import { QuestionDto } from '../../models/question.model';
import Swal from 'sweetalert2';
import { ExamCreationDto } from '../../models/examCreationDto.model';
import { AnswerOptionDTO } from '../../models/answeroptiondto.model';
import { Location } from '@angular/common';

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
  selector: 'app-create-module-exam',
  templateUrl: './create-module-exam.component.html',
  styleUrl: './create-module-exam.component.css'
})
export class CreateModuleExamComponent implements OnInit{
  lessonId: number = -1;
  lessons :Lesson[] =[];
  lesson!: { title: ''; };
  modules: Module[] = [{ id: 1, name: '', file: '', fileInput: null, fileType: '' ,done:false}];


  isSidebarOpen = true;
  activeTab: string = 'createModule';
examForm: any;

 //Create Exam
 examId: number = 1; // Example exam ID
 examTitle: string='';
 examDescription: string= '';
 formDescription: string = 'Please fill out this form';

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

 showResults: boolean = false; // Add this property to toggle result display



  constructor(private route: ActivatedRoute,
    private lessonService: LessonService,
    private examService: ExamService,
    private courseModuleService:CourseModuleService,
    private location: Location,
    private router:Router
   ) {}

   ngOnInit(): void {
    const lessonIdParam = this.route.snapshot.paramMap.get('lessonId');
    console.log('Lesson ID Param:', lessonIdParam);

    if (lessonIdParam !== null) {
      this.lessonId = +lessonIdParam; // Convert courseIdParam to number if not null
    }
  }

  addModule() {
    this.modules.push({ id:1,name: '', file:'',fileInput: null, fileType:'',done:false }); // Initialize File as null
    console.log(this.modules);
    
  }

  removeModule(index: number) {
    this.modules.splice(index, 1);
    console.log(this.modules);
    
  }


  onSubmit(lessonForm: any) {
    if (lessonForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to submit these modules?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit!',
        cancelButtonText: 'No, cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          const formData = new FormData();
        const modulesData: any[] = [];

        this.modules.forEach((module, index) => {
          const moduleData = {
            name: module.name,
            lessonId: this.lessonId.toString(),
          };
          modulesData.push(moduleData);
          if (module.fileInput) {
            formData.append('files', module.fileInput);
          }
        });

        formData.append('modules', new Blob([JSON.stringify(modulesData)], { type: 'application/json' }));
        console.log("FormData content before sending:", formData);


          this.courseModuleService.createModules(formData).subscribe(
            (response) => {
              console.log('Modules Created:', response);
              Swal.fire('Success!', response.message, 'success');
            },
            (error) => {
              console.error('Error creating modules:', error);
              Swal.fire('Error!', error.error.error, 'error');
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Module creation cancelled.', 'info');
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
    if (this.questions[qIndex].options.length > 1) {
      this.questions[qIndex].options.splice(oIndex, 1);
    }
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

  onSubmitExam(examForm: any) {
    const examCreationDto: ExamCreationDto = {
      lessonId: this.lessonId,

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
        // this.checkAnswers(response);
        // this.showResults = true; // Show the results
      }, error => {
        console.error('Error submitting form', error);
      });
  }

  // checkAnswers(response: any) {
  //   this.questions.forEach((question, qIndex) => {
  //     question.correctAnswer = response.questionList[qIndex].correctAnswer; // Assuming the correct answer is provided in the response
  //     question.options.forEach(option => {
  //       option.isCorrect = option.isAnswered && (option.label === question.correctAnswer);
  //     });
  //   });
  // }

  goBack() {
    this.location.back();
  }


 }
