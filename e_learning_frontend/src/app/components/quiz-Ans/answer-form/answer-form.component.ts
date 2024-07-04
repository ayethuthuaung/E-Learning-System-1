
import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { QuestionService } from '../../services/question.service';
import { ExamDTO } from '../../models/examdto.model';
import { StudentAnswer } from '../../models/student-answer.model'; // Ensure StudentAnswer is imported if defined
import { log } from 'console';

interface Option {
  id: number;
  label: string;
  value: string;
  isAnswered: boolean;
  isCorrect?: boolean;
  isSelected?: boolean;
}

interface Question {
  id: number;
  text: string;
  type: string;
  options: Option[];
  correctAnswer?: string;
}

@Component({
  selector: 'app-answer-question-form',
  templateUrl: './answer-form.component.html',
  styleUrls: ['./answer-form.component.css']
})
export class AnswerFormComponent implements OnInit {
  questions: Question[] = [];
  showResults: boolean = false;

  constructor(private examService: ExamService, private questionService: QuestionService) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {

    // Fetch exam and questions data

    this.examService.getExamById(1).subscribe((data: ExamDTO) => {
      this.questions = data.questions.map(question => ({
        id: question.id,
        text: question.content,
        type: question.questionTypeId === 1 ? 'multiple-choice' : 'checkbox',
        options: question.answerList.map(option => ({
          id: option.id,
          label: option.answer,
          value: option.answer,
          isAnswered: false
        })),
        correctAnswer: ''
      }));
    });
  }

  selectOption(questionIndex: number, optionIndex: number) {
    const question = this.questions[questionIndex];
    if (question.type === 'multiple-choice') {
      question.options.forEach((option, idx) => {
        option.isAnswered = idx === optionIndex;
      });
    } else {
      question.options[optionIndex].isAnswered = !question.options[optionIndex].isAnswered;
    }
  }

  submitAnswers() {
    const answers: StudentAnswer[] = this.questions.map(question => ({
      questionId: question.id,
      answerOptionId: question.options.find(option => option.isAnswered)?.id || 0, // Replace with appropriate default if no option is selected
      isAnswered: question.options.some(option => option.isAnswered)
    }));

    this.questionService.submitStudentAnswers(answers).subscribe(response => {
      console.log('Answers submitted successfully', response);
      this.checkAnswers(response);
      this.showResults = true;
    }, error => {
      console.error('Error submitting answers', error);
    });
  }

  checkAnswers(response: any) {
    response.forEach((res: any) => {
      const question = this.questions.find(q => q.id === res.question.id);
      if (question) {
        question.correctAnswer = res.correctAnswerId;
        question.options.forEach(option => {
          option.isCorrect = option.id === res.correctAnswerId;
          option.isSelected = option.id === res.selectedOptionId;
        });
      }
    });
  }
  
  
}




