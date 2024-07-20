import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ExamService } from '../../../services/exam.service';
import { QuestionService } from '../../../services/question.service';
import { StudentAnswerService } from '../../../services/student-answer.service';
import { UserService } from '../../../services/user.service';
import { ExamDTO } from '../../../models/examdto.model';
import { StudentAnswer } from '../../../models/student-answer.model';
import { Role } from '../../../models/user.model';
import html2canvas from 'html2canvas';

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
  styleUrls: ['./student-question-form.component.css']
})
export class StudentQuestionFormComponent implements OnInit, OnDestroy {
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
  questionTotalMarks: number = 0;

  isOwner: boolean = false;

  duration: string = '';
  remainingTime: number = 0; // Remaining time in seconds

  timerInterval: any; 

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService, 
    private questionService: QuestionService,
    private studentAnswerService: StudentAnswerService,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.examId = +params.get('examId')!;
      if (this.examId != null) {
        this.loadQuestions(this.examId);
      }
      this.exam = history.state.exam;
      if (this.exam && this.exam.duration) {
        this.startTimer(this.parseDuration(this.exam.duration));
      }
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

  parseDuration(duration: string): number {
    const parts = duration.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    return (hours * 3600) + (minutes * 60) + seconds;
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval); // Clear interval when component is destroyed
  }

  startTimer(durationSeconds: number): void {
    this.remainingTime = durationSeconds;

    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(this.timerInterval);
        this.submitAnswers(); // Auto-submit when timer expires
      }
    }, 1000); // Update every second
  }

  formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${this.pad(hrs)}:${this.pad(mins)}:${this.pad(secs)}`;
  }
  
  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }


  hasRole(roleId: number): boolean {
    return this.roles.some(role => role.id === roleId);
  }

  checkOwner() {
    this.userService.checkExamOwner(this.userId).subscribe((response) => {
      this.isOwner = response;
    });
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
      this.questionTotalMarks = this.questions.reduce((total, question) => total + question.marks, 0);
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
    clearInterval(this.timerInterval);
    const answers: StudentAnswer[] = this.questions.map(question => ({
      questionId: question.id,
      answerOptionId: question.options.find(option => option.isAnswered)?.id || null,
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
        
        question.correctAnswers = res.correctAnswerIds || [];
        const selectedOptions = question.options.filter(option => option.isAnswered).map(option => option.id);
  
        question.options.forEach(option => {
          if(question.correctAnswers)
          option.isCorrect = question.correctAnswers.includes(option.id);
          option.isSelected = selectedOptions.includes(option.id);
        });
        
        if (question.type === 'multiple-choice') {
          const selectedOption = question.options.find(option => option.isAnswered);
          if(question.correctAnswers)
          if (selectedOption && question.correctAnswers.includes(selectedOption.id)) {
            this.totalMarks += question.marks;
          }
        } else if (question.type === 'checkbox') {
          if(question.correctAnswers)
          if (selectedOptions.length === question.correctAnswers.length && selectedOptions.every(id => question.correctAnswers!.includes(id))) {
            this.totalMarks += question.marks;
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

  goBack() {
    this.location.back();
  }
}
