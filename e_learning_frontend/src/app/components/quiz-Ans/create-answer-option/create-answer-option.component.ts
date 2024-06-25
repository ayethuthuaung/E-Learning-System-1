import { Component, OnInit } from '@angular/core';
import { AnswerOptionService } from '../../services/answerOption.service';
import { QuestionService } from '../../services/question.service';
import { Router } from '@angular/router';
import { AnswerOptionDTO } from '../../models/answerOption.model';
import { QuestionDTO } from '../../models/question.model';

@Component({
  selector: 'app-create-answer-option',
  templateUrl: './create-answer-option.component.html',
  styleUrls: ['./create-answer-option.component.css']
})
export class CreateAnswerOptionComponent implements OnInit {
  answerOption: AnswerOptionDTO = { answer: '', isAnswered: false };
  questions: QuestionDTO[] = [];
  submitted = false;

  constructor(
    private answerOptionService: AnswerOptionService,
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getViewList().subscribe(
      (data: QuestionDTO[]) => {
        this.questions = data;
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  onSubmit(): void {
    this.answerOptionService.createAnswerOption(this.answerOption).subscribe(
      (data) => {
        console.log('Answer Option created successfully:', data);
        this.goToAnswerOptionList();
      },
      (error) => {
        console.error('Error creating answer option:', error);
      }
    );
  }

  goToAnswerOptionList(): void {
    this.router.navigate(['/answer-options']);
  }
}
