// exam-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ExamDTO } from '../../models/examdto.model';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class QuizExamListComponent  implements OnInit {
  exams: ExamDTO[] = [];

  constructor(private examService: ExamService) { }

  ngOnInit(): void {
    this.examService.getExams().subscribe(data => {
      this.exams = data;
    });
  }
}
