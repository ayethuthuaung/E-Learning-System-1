import { Component, OnInit } from '@angular/core';
import { Exam } from '../models/exam.model';
import { Question_Type } from '../models/question-type.model';
import { ExamService } from '../services/exam.service';
import { QuestionTypeService } from '../services/question-type.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.css']
})
export class CreateExamComponent implements OnInit {
  exam: Exam = new Exam();
  questionTypes: Question_Type[] = [];
  message = '';
  submitted = false;

  constructor(
    private examService: ExamService,
    private questionTypeService: QuestionTypeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadQuestionTypes();
  }

  loadQuestionTypes(): void {
    this.questionTypeService.getQuestionTypes().subscribe(
      (data: Question_Type[]) => {
        this.questionTypes = data;
      },
      (error) => {
        console.error('Error fetching question types:', error);
      }
    );
  }

  saveExam(): void {
    this.examService.createExam(this.exam).subscribe(
      (data) => {
        console.log('Exam created successfully:', data);
        this.goToExamList();
      },
      (error) => {
        console.error('Error creating exam:', error);
      }
    );
  }

  goToExamList(): void {
    this.router.navigate(['/exams']);
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.submitted = false;
      this.saveExam();
    } else {
      this.submitted = true;
      console.log('Invalid form');
    }
  }

  toggleQuestionType(event: any, questionType: Question_Type): void {
    if (event.target.checked) {
      // If checked, add the question type to the exam's questionTypes array
      this.exam.questionTypes.push(questionType);
    } else {
      // If unchecked, remove the question type from the exam's questionTypes array
      const index = this.exam.questionTypes.findIndex(q => q.id === questionType.id);
      if (index !== -1) {
        this.exam.questionTypes.splice(index, 1);
      }
    }
    console.log('Updated exam:', this.exam);
  }
}
