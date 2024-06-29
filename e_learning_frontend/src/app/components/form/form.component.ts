// form.component.ts
import { Component } from '@angular/core';

interface Option {
  label: string;
  value: string;
}

interface Question {
  text: string;
  type: string;
  options: Option[];
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  formTitle: string = 'Untitled Form';
  formDescription: string = 'Please fill out this form';

  questions: Question[] = [
    {
      text: 'Untitled Question',
      type: 'multiple-choice',
      options: [
        { label: 'Option 1', value: 'option1' }
      ]
    }
  ];

  addOption(questionIndex: number) {
    this.questions[questionIndex].options.push({
      label: `Option ${this.questions[questionIndex].options.length + 1}`,
      value: `option${this.questions[questionIndex].options.length + 1}`
    });
  }

  addQuestion() {
    this.questions.push({
      text: 'New Question',
      type: 'multiple-choice',
      options: [
        { label: 'Option 1', value: 'option1' }
      ]
    });
  }
}
