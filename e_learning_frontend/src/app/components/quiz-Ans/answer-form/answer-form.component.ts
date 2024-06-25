import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { QuestionService } from '../../services/question.service';
import { ExamDTO } from '../../models/examdto.model';

interface Option {
  label: string;
  value: string;
  isAnswered: boolean;
}

interface Question {
  id: number;
  text: string;
  type: string;
  options: Option[];
}

@Component({
  selector: 'app-answer-question-form',
  templateUrl: './answer-form.component.html',
  styleUrls: ['./answer-form.component.css']
})
export class AnswerFormComponent implements OnInit {
  questions: Question[] = [];

  constructor(private examService: ExamService,private questionService : QuestionService) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.examService.getExamById(1).subscribe((data: ExamDTO) => {
      this.questions = data.questions.map(question => ({
        id: question.id,
        text: question.content,
        type: question.questionTypeId === 1 ? 'multiple-choice' : 'checkbox',
        options: question.answerList ? question.answerList.map(option => ({
          label: option.answer,
          value: option.answer,
          isAnswered: false
        })) : []
      }));
    });
  }

  selectOption(questionIndex: number, optionIndex: number) {
    const question = this.questions[questionIndex];
    question.options.forEach((option, idx) => {
      option.isAnswered = question.type === 'multiple-choice' ? idx === optionIndex : option.isAnswered;
    });
  }

  submitAnswers() {
    const answers = this.questions.map(question => ({
      questionId: question.id,
      selectedOptions: question.options.filter(option => option.isAnswered).map(option => option.value)
    }));

    // Assuming `questionService.submitAnswers` exists and is correctly implemented
    this.questionService.submitAnswers(answers).subscribe(response => {
      console.log('Answers submitted successfully', response);
    }, error => {
      console.error('Error submitting answers', error);
    });
  }
}
