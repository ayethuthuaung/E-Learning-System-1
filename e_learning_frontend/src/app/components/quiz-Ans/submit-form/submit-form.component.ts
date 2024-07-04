// submit-form.component.ts

import { Component, OnInit } from '@angular/core';
import { QuestionDTO } from '../../models/question.model';
import { StudentAnswer } from '../../models/student-answer.model';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-submit-form',
  templateUrl: './submit-form.component.html',
  styleUrls: ['./submit-form.component.css']
})
export class SubmitFormComponent implements OnInit {

  questions: QuestionDTO[] = [];
  studentAnswers: StudentAnswer[] = [];
  showResults: boolean = false;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    // Assume you have a method to fetch questions from your service
    this.loadQuestions();
  }

  loadQuestions() {
    const examId = 1; // Replace with your actual exam ID or fetch dynamically
    this.questionService.getQuestionsForExam(examId).subscribe(
      (questions: QuestionDTO[]) => {
        this.questions = questions;
        // Initialize studentAnswers array based on questions length
        this.studentAnswers = new Array(this.questions.length).fill({ questionId: 0, answerOptionId: null, isAnswered: false });
      },
      (error) => {
        console.error('Failed to load questions:', error);
      }
    );
  }

  getSelectedAnswerText(question: QuestionDTO, selectedOptionId: number | null): string {
    if (selectedOptionId === null) {
      return 'No answer selected';
    }
    const selectedAnswer = question.answerList.find(answer => answer.id === selectedOptionId);
    return selectedAnswer ? selectedAnswer.answer : 'No answer selected';
  }

  submitAnswers() {
    // Logic to submit student answers to your service
    this.questionService.submitStudentAnswers(this.studentAnswers).subscribe(
      (response) => {
        console.log('Answers submitted successfully:', response);
        this.showResults = true; // Show results after successful submission
      },
      (error) => {
        console.error('Failed to submit answers:', error);
      }
    );
  }

  isAnswerCorrect(question: QuestionDTO): boolean {
    // Logic to determine if the selected answer(s) for a question are correct
    // This depends on your application's business logic and how answers are evaluated
    // You need to compare the selected answers in studentAnswers with the correct answers in question.answerList
    // For simplicity, assuming each question may have only one correct answer
    const selectedAnswer = this.studentAnswers.find(answer => answer.questionId === question.id);
    if (!selectedAnswer) {
      return false; // No answer selected
    }
    const correctAnswer = question.answerList.find(answer => answer.id === selectedAnswer.answerOptionId);
    return correctAnswer ? correctAnswer.isAnswered : false;
  }
}
