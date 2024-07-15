import { UserService } from './../../../services/user.service';
import { StudentAnswerService } from './../../../services/student-answer.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { QuestionService } from '../../../services/question.service';
import { StudentAnswer } from '../../../models/student-answer.model';
import { ExamDTO } from '../../../models/examdto.model';
import html2canvas from 'html2canvas';
import { Role } from '../../../models/user.model';

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
  marks: number;
  options: Option[];
  correctAnswers?: number[];
}

@Component({
  selector: 'app-student-question-form',
  templateUrl: './student-question-form.component.html',
  styleUrl: './student-question-form.component.css'
})
export class StudentQuestionFormComponent implements OnInit {
  @ViewChild('questionFormContainer') questionFormContainer!: ElementRef;

  exam!: ExamDTO;
  examId: any;
  loggedUser: any = '';
  roles: Role[] = [];
  userId: any;
  instructorId: any;
  instructorName: string = ''; 

  questions: Question[] = [];
  showResults: boolean = false;
  totalMarks: number = 0;
  totalQuestionCounts: number = 0;

  isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService, 
    private questionService: QuestionService,
    private studentAnswerService: StudentAnswerService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.examId = +params.get('examId')!;
      if (this.examId != null) {
        this.loadQuestions(this.examId);
      }
      this.exam = history.state.exam;
    });

    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      if (this.loggedUser) {
        this.userId = this.loggedUser.id;
        this.roles = this.loggedUser.roles;

        // Access role IDs
        if (this.roles.length > 0) {
          this.roles.forEach(role => {
            console.log(role.id); // Print each role ID
          });
        }

      }
    }
  }

  
  hasRole(roleId: number): boolean {
    return this.roles.some(role => role.id === roleId);
  }

  checkOwner() {
    this.userService.checkExamOwner(this.userId).subscribe(
      (response) => {
        this.isOwner = response;
      }
    );
  }

  loadQuestions(examId: number) {
    this.examService.getExamById(examId).subscribe((data: ExamDTO) => {
      this.questions = data.questions.map(question => ({
        id: question.id,
        text: question.content,
        type: question.questionTypeId === 1 ? 'multiple-choice' : 'checkbox',
        marks: question.marks,
        options: this.shuffleArray(question.answerList.map(option => ({
          id: option.id,
          label: option.answer,
          value: option.answer,
          isAnswered: false
        }))),
        correctAnswers: []
      }));
      this.totalQuestionCounts = this.questions.length;
    });
  }

  shuffleArray(array: any[]): any[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
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
      answerOptionId: question.options.find(option => option.isAnswered)?.id || 0,
      isAnswered: question.options.some(option => option.isAnswered),
      userId: this.userId,
    }));

    this.studentAnswerService.submitStudentAnswers(answers).subscribe(response => {
      this.checkAnswers(response);
      this.showResults = true;
    }, error => {
      console.error('Error submitting answers', error);
    });
  }

  checkAnswers(response: any) {
    console.log(response);
  
    response.forEach((res: any) => {
      console.log(res);
      
      const question = this.questions.find(q => q.id === res.questionId);
      if (question) {
        console.log(question);
        
        question.correctAnswers = res.correctAnswerIds || []; // Ensure correctAnswers is always an array
        const selectedOptions = question.options.filter(option => option.isAnswered).map(option => option.id);
  
        question.options.forEach(option => {
          if(question.correctAnswers) {
            option.isCorrect = question.correctAnswers.includes(option.id);
            option.isSelected = selectedOptions.includes(option.id);
          }
        });
        
        if(question.correctAnswers){
          if (question.type === 'multiple-choice') {
            const selectedOption = question.options.find(option => option.isAnswered);

            if (selectedOption && question.correctAnswers.includes(selectedOption.id)) {
              this.totalMarks += question.marks;
            }
          } else if (question.type === 'checkbox') {
            if (selectedOptions.length === question.correctAnswers.length && selectedOptions.every(id => question.correctAnswers!.includes(id))) {
              this.totalMarks += question.marks;
            }
          }
        }
      }
    });
  }

  captureScreenshot() {
    const container = this.questionFormContainer.nativeElement;
    html2canvas(container).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'Answer-Form.png';
      link.click();
    });
  }

  getOptionLabel(question: Question, correctAnswerId: number): string | undefined {
    const option = question.options.find(option => option.id === correctAnswerId);
    return option ? option.label : undefined;
  }
}
