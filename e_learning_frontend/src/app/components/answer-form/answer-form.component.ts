// // answer-form.component.ts
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
// import { QuestionService } from '../services/question.service';
// import { QuestionDTO } from '../models/question.model';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-answer-form',
//   templateUrl: './answer-form.component.html',
//   styleUrls: ['./answer-form.component.css']
// })
// export class AnswerFormComponent implements OnInit {
//   examId: number = 1; // Example exam ID, can be dynamically set
//   questions: QuestionDTO[] = [];
//   answerForm: FormGroup = this.fb.group({
//     answers: this.fb.array([])
//   });

//   constructor(
//     private fb: FormBuilder,
//     private questionService: QuestionService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loadQuestions();
//   }

//   loadQuestions(): void {
//     this.questionService.getQuestionsForExam(this.examId).subscribe(
//       (data: QuestionDTO[]) => {
//         this.questions = data;
//         this.initializeForm();
//       },
//       (error) => {
//         console.error('Error fetching questions:', error);
//       }
//     );
//   }

//   initializeForm(): void {
//     const answersArray = this.answerForm.get('answers') as FormArray;
//     this.questions.forEach((question) => {
//       const answerGroup = this.fb.group({
//         questionId: [question.id],
//         options: this.fb.array(
//           (question.answerList || []).map(option => this.fb.group({
//             optionId: [option.id],
//             isAnswered: [false]
//           }))
//         )
//       });
//       answersArray.push(answerGroup);
//     });
//   }

//   get answers(): FormArray {
//     return this.answerForm.get('answers') as FormArray;
//   }

//   getOptionsForQuestion(index: number): FormArray {
//     return this.answers.at(index).get('options') as FormArray;
//   }

//   onSubmit(): void {
//     console.log('Form Submitted', this.answerForm.value);
//     // Handle form submission to backend
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { QuestionService } from '../services/question.service';
import { QuestionDTO, AnswerOptionDTO } from '../models/question.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-answer-form',
  templateUrl: './answer-form.component.html',
  styleUrls: ['./answer-form.component.css']
})
export class AnswerFormComponent implements OnInit {
  examId: number = 1; // Example exam ID, can be dynamically set
  questions: QuestionDTO[] = [];
  answerForm: FormGroup = this.fb.group({
    answers: this.fb.array([])
  });

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getQuestionsForExam(this.examId).subscribe(
      (data: QuestionDTO[]) => {
        this.questions = data;
        this.initializeForm();
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  initializeForm(): void {
    const answersArray = this.answerForm.get('answers') as FormArray;
    this.questions.forEach((question) => {
      console.log('Question:', question);
      const answerGroup = this.fb.group({
        questionId: [question.id],
        options: this.fb.array(
          question.answerList.map(option => this.fb.group({
            optionId: [option.id],
            isAnswered: [false]
          }))
        )
      });
      answersArray.push(answerGroup);
    });
    console.log('Form:', this.answerForm.value); // Check the entire form value
  }
  

  get answers(): FormArray {
    return this.answerForm.get('answers') as FormArray;
  }

  getOptionsForQuestion(index: number): FormArray {
    return this.answers.at(index).get('options') as FormArray;
  }

  onSubmit(): void {
    console.log('Form Submitted', this.answerForm.value);
    // Handle form submission to backend
  }
}

