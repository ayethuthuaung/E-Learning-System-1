// exam-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamDTO } from '../../models/examdto.model';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css']
})
export class ExamDetailComponent implements OnInit {
  exam: ExamDTO | undefined;

  constructor(private route: ActivatedRoute, private examService: ExamService) { }

  ngOnInit(): void {
    const examId = Number(this.route.snapshot.paramMap.get('id'));
    this.examService.getExamWithQuestions(examId).subscribe(data => {
      this.exam = data;
    });
  }
}
