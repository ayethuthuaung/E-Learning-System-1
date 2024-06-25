// import { Component, OnInit } from '@angular/core';
// import { NgForm } from '@angular/forms';
// import { Question } from '../models/question.model';
// import { QuestionService } from '../services/question.service';
// import { Exam } from '../models/exam.model';
// import { Question_Type } from '../models/question-type.model';
// import { ExamService } from '../services/exam.service';
// import { QuestionTypeService } from '../services/question-type.service';

// @Component({
//   selector: 'app-create-question',
//   templateUrl: './create-question.component.html',
//   styleUrls: ['./create-question.component.css']
// })
// export class CreateQuestionComponent implements OnInit {

//   //currentQuestion: Question = new Question();
//   exams: Exam[] = [];
//   questionTypes: Question_Type[] = [];
//   message = '';
//   submitted = false;

//   constructor(
//     private questionService: QuestionService,
//     private examService: ExamService,
//     private questionTypeService: QuestionTypeService
//   ) { }

//   ngOnInit(): void {
//     this.loadExams();
//     this.loadQuestionTypes();
//   }

//   loadExams(): void {
//     this.examService.getViewList().subscribe(
//       (data: Exam[]) => {
//         this.exams = data;
//       },
//       (error) => {
//         console.error('Error fetching exams:', error);
//       }
//     );
//   }

//   loadQuestionTypes(): void {
//     this.questionTypeService.getQuestionTypeList().subscribe(
//       (data: Question_Type[]) => {
//         this.questionTypes = data;
//       },
//       (error) => {
//         console.error('Error fetching question types:', error);
//       }
//     );
//   }

//   // createQuestion(form: NgForm): void {
//   //   if (form.valid) {
//   //     //this.questionService.createQuestion(this.currentQuestion).subscribe({
//   //       next: (data) => {
//   //         console.log('Question created successfully:', data);
//   //         this.message = 'Question created successfully!';
//   //         this.resetForm(form);
//   //       },
//   //       error: (error) => {
//   //         console.error('Error creating question:', error);
//   //         this.message = 'Error creating question. Please try again.';
//   //       }
//   //     });
//   //   } else {
//   //     console.log('Invalid form');
//   //     this.submitted = true;
//   //   }
//   // }

//   // onSubmit(form: NgForm): void {
//   //   if (form.valid) {
//   //     this.createQuestion(form);
//   //   } else {
//   //     console.log('Invalid form');
//   //     this.submitted = true;
//   //   }
//   // }

//   // resetForm(form: NgForm): void {
//   //   form.resetForm();
//   //   //this.currentQuestion = new Question();
//   //   this.submitted = false;
//   //   this.message = '';
//   // }

// }
