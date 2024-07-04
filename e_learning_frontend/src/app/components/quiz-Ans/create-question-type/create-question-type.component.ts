import { Component, OnInit } from '@angular/core';
import { Question_Type } from '../../models/question-type.model';
import { QuestionTypeService } from '../../services/question-type.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-question-type',
  templateUrl: './create-question-type.component.html',
  styleUrls: ['./create-question-type.component.css']
})
export class CreateQuestionTypeComponent implements OnInit {
  questionType: Question_Type = new Question_Type();
  message = '';
  submitted = false;

  constructor(
    private questionTypeService: QuestionTypeService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  saveQuestionType(): void {
    this.questionTypeService.createQuestionType(this.questionType).subscribe(
      (data) => {
        console.log('Question type created successfully:', data);
        this.goToQuestionTypeList();
      },
      (error) => {
        console.error('Error creating question type:', error);
      }
    );
  }

  goToQuestionTypeList(): void {
    this.router.navigate(['/question-types']);
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.submitted = false;
      this.saveQuestionType();
    } else {
      this.submitted = true;
      console.log('Invalid form');
    }
  }
}
