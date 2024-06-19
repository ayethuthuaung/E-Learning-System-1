import { Component } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { QuestionDTO } from '../models/question.model';
import { QuestionCreationDTO } from '../models/QuestionCreationDTO.model';
import { AnswerOptionDTO } from '../models/answerOption.model';

interface Option {
  label: string;
  value: string;
  isAnswered: boolean;
}

interface Question {
  text: string;
  type: string;
  options: Option[];
}

@Component({
  selector: 'app-form',
  templateUrl: './create-question-form.component.html',
  styleUrls: ['./create-question-form.component.css']
})
export class CreateQuestionFormComponent {
  examId: number = 1; // Example exam ID
  formDescription: string = 'Please fill out this form';

  questions: Question[] = [
    {
      text: 'Untitled Question',
      type: 'multiple-choice',
      options: [
        { label: 'Option 1', value: 'option1', isAnswered: false }
      ]
    }
  ];

  constructor(private questionService: QuestionService) {}

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
      ]
    });
  }
  selectOption(questionIndex: number, optionIndex: number) {
    const question = this.questions[questionIndex];
    question.options.forEach((option, idx) => {
      option.isAnswered = (idx === optionIndex);
    });
  }
  submitForm() {
    const questionCreationDTO: QuestionCreationDTO = {
      examId: this.examId,
      questionList: this.questions.map(question => ({
        content: question.text,
        questionTypeId: question.type === 'multiple-choice' ? 1 : 2, // Map types to IDs
        answerList: question.options.map(option => ({
          answer: option.label,
          isAnswered: option.isAnswered
        } as AnswerOptionDTO))
      } as QuestionDTO))
    };

    this.questionService.createQuestion([questionCreationDTO])
      .subscribe(response => {
        console.log('Form submitted successfully', response);
      }, error => {
        console.error('Error submitting form', error);
      });
  }
}
